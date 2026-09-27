import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime
from backend.config import DB_PATH

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS images (
                id TEXT PRIMARY KEY,
                prompt TEXT NOT NULL,
                enhanced_prompt TEXT,
                style TEXT,
                aspect_ratio TEXT,
                width INTEGER,
                height INTEGER,
                image_url TEXT NOT NULL,
                file_path TEXT,
                provider TEXT,
                model TEXT,
                seed INTEGER,
                is_favorite INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                mode TEXT DEFAULT 'text2img'
            )
        """)
        # Create indices for fast queries
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_images_created ON images (created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_images_favorite ON images (is_favorite)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_images_style ON images (style)")
        conn.commit()

def save_image_record(data: Dict[str, Any]) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        created_at = data.get("created_at") or datetime.utcnow().isoformat() + "Z"
        cursor.execute("""
            INSERT OR REPLACE INTO images (
                id, prompt, enhanced_prompt, style, aspect_ratio,
                width, height, image_url, file_path, provider,
                model, seed, is_favorite, created_at, mode
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["prompt"],
            data.get("enhanced_prompt", ""),
            data.get("style", "None"),
            data.get("aspect_ratio", "1:1"),
            data.get("width", 1024),
            data.get("height", 1024),
            data["image_url"],
            data.get("file_path", ""),
            data.get("provider", "pollinations"),
            data.get("model", "flux"),
            data.get("seed", 0),
            1 if data.get("is_favorite") else 0,
            created_at,
            data.get("mode", "text2img")
        ))
        conn.commit()
    return get_image_by_id(data["id"])

def get_image_by_id(image_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return dict(row)

def get_images(
    limit: int = 60,
    offset: int = 0,
    style: Optional[str] = None,
    favorite_only: bool = False,
    search: Optional[str] = None,
    mode: Optional[str] = None
) -> List[Dict[str, Any]]:
    query = "SELECT * FROM images WHERE 1=1"
    params = []

    if favorite_only:
        query += " AND is_favorite = 1"

    if style and style.lower() != "all":
        query += " AND LOWER(style) = LOWER(?)"
        params.append(style)

    if mode and mode.lower() != "all":
        query += " AND mode = ?"
        params.append(mode)

    if search and search.strip():
        query += " AND (prompt LIKE ? OR enhanced_prompt LIKE ?)"
        term = f"%{search.strip()}%"
        params.extend([term, term])

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def toggle_favorite(image_id: str) -> Optional[bool]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT is_favorite FROM images WHERE id = ?", (image_id,))
        row = cursor.fetchone()
        if not row:
            return None
        new_val = 0 if row["is_favorite"] == 1 else 1
        cursor.execute("UPDATE images SET is_favorite = ? WHERE id = ?", (new_val, image_id))
        conn.commit()
        return bool(new_val)

def delete_image_record(image_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM images WHERE id = ?", (image_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        return deleted

def get_stats() -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as total FROM images")
        total = cursor.fetchone()["total"]
        cursor.execute("SELECT COUNT(*) as favs FROM images WHERE is_favorite = 1")
        favs = cursor.fetchone()["favs"]
        cursor.execute("SELECT style, COUNT(*) as count FROM images GROUP BY style ORDER BY count DESC LIMIT 5")
        top_styles = [dict(row) for row in cursor.fetchall()]
        return {
            "total_images": total,
            "total_favorites": favs,
            "top_styles": top_styles
        }

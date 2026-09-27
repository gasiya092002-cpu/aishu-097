from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pathlib import Path
from backend.database import (
    get_images,
    get_image_by_id,
    toggle_favorite,
    delete_image_record,
    get_stats
)

router = APIRouter(prefix="/api/gallery", tags=["gallery"])

@router.get("")
async def get_gallery_images(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    style: Optional[str] = None,
    favorite_only: bool = False,
    search: Optional[str] = None,
    mode: Optional[str] = None
):
    images = get_images(
        limit=limit,
        offset=offset,
        style=style,
        favorite_only=favorite_only,
        search=search,
        mode=mode
    )
    return {"images": images, "count": len(images)}

@router.get("/stats")
async def get_gallery_stats():
    return get_stats()

@router.get("/{image_id}")
async def get_single_image(image_id: str):
    image = get_image_by_id(image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

@router.post("/{image_id}/favorite")
async def toggle_image_favorite(image_id: str):
    new_fav = toggle_favorite(image_id)
    if new_fav is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"id": image_id, "is_favorite": new_fav}

@router.delete("/{image_id}")
async def delete_image(image_id: str):
    image = get_image_by_id(image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Remove file from disk if present
    file_path = image.get("file_path")
    if file_path:
        p = Path(file_path)
        if p.exists():
            try:
                p.unlink()
            except Exception:
                pass

    delete_image_record(image_id)
    return {"success": True, "deleted_id": image_id}

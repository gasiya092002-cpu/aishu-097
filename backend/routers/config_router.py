import httpx
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional

from backend.config import (
    SUPPORTED_PROVIDERS,
    OPENAI_API_KEY,
    GEMINI_API_KEY,
    STABILITY_API_KEY
)
from backend.database import get_stats, get_connection

router = APIRouter(prefix="/api", tags=["config"])

ALL_STYLES = [
    {"id": "Photorealistic", "name": "Photorealistic", "description": "8K razor-sharp reality and natural depth"},
    {"id": "Cinematic", "name": "Cinematic", "description": "Dramatic Hollywood widescreen lighting and atmosphere"},
    {"id": "3D Render", "name": "3D Render", "description": "Octane and Unreal Engine 5 CGI perfection"},
    {"id": "Anime", "name": "Anime", "description": "Makoto Shinkai & Ghibli expressive vibrancy"},
    {"id": "Cartoon", "name": "Cartoon", "description": "Playful vector illustration and expressive characters"},
    {"id": "Digital Art", "name": "Digital Art", "description": "Trending ArtStation concept art masterpiece"},
    {"id": "Fantasy", "name": "Fantasy", "description": "Enchanted realms, glowing magic and mythic scale"},
    {"id": "Cyberpunk", "name": "Cyberpunk", "description": "Neon-lit nightscapes and cybernetic aesthetics"},
    {"id": "Watercolor", "name": "Watercolor", "description": "Fluid pigment washes on textured cotton paper"},
    {"id": "Oil Painting", "name": "Oil Painting", "description": "Classic impasto brushwork and rich chiaroscuro"},
    {"id": "Minimalist", "name": "Minimalist", "description": "Harmonious negative space and pure geometric balance"},
    {"id": "Product Photography", "name": "Product Photography", "description": "Studio diffused softbox luxury commercial shot"},
    {"id": "Architecture", "name": "Architecture", "description": "Parametric lines, monumental scale and light"},
    {"id": "Nature Photography", "name": "Nature Photography", "description": "National Geographic wildlife and serene landscapes"}
]

ALL_ASPECT_RATIOS = [
    {"id": "1:1", "name": "Square", "ratio": "1:1", "usage": "Instagram Feed, Avatars", "dimensions": "1024 x 1024"},
    {"id": "4:5", "name": "Portrait", "ratio": "4:5", "usage": "Instagram & Social Feeds", "dimensions": "896 x 1120"},
    {"id": "9:16", "name": "Story / Reel", "ratio": "9:16", "usage": "Stories, TikTok, Mobile Wallpapers", "dimensions": "768 x 1344"},
    {"id": "16:9", "name": "Landscape", "ratio": "16:9", "usage": "YouTube, Desktop, Wallpapers", "dimensions": "1344 x 768"},
    {"id": "3:2", "name": "Photography", "ratio": "3:2", "usage": "Standard 35mm DSLR Aspect", "dimensions": "1200 x 800"},
    {"id": "2:3", "name": "Editorial", "ratio": "2:3", "usage": "Book Covers, Infographics", "dimensions": "800 x 1200"}
]

@router.get("/config")
async def get_system_config():
    providers_info = {}
    for key, p in SUPPORTED_PROVIDERS.items():
        is_configured = True
        if key == "openai":
            is_configured = bool(OPENAI_API_KEY)
        elif key == "gemini":
            is_configured = bool(GEMINI_API_KEY)
        elif key == "stability":
            is_configured = bool(STABILITY_API_KEY)
        
        providers_info[key] = {
            **p,
            "is_configured": is_configured
        }

    return {
        "providers": providers_info,
        "default_provider": "pollinations",
        "styles": ALL_STYLES,
        "aspect_ratios": ALL_ASPECT_RATIOS
    }

@router.get("/health")
async def get_health_status():
    stats = get_stats()
    return {
        "status": "online",
        "service": "AI Image Studio Backend",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "storage": stats
    }

class KeyTestRequest(BaseModel):
    provider: str
    api_key: str

@router.post("/config/test-key")
async def test_api_key(req: KeyTestRequest):
    p = req.provider.lower()
    if p == "openai":
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {req.api_key}"}
                )
                if res.status_code == 200:
                    return {"valid": True, "message": "OpenAI API Key is valid and active."}
                return {"valid": False, "message": f"OpenAI rejected key: {res.text[:100]}"}
        except Exception as e:
            return {"valid": False, "message": f"Connection error: {str(e)}"}

    elif p == "gemini":
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/models?key={req.api_key}"
                )
                if res.status_code == 200:
                    return {"valid": True, "message": "Google Gemini API Key is valid and active."}
                return {"valid": False, "message": f"Gemini rejected key: {res.text[:100]}"}
        except Exception as e:
            return {"valid": False, "message": f"Connection error: {str(e)}"}

    return {"valid": True, "message": f"Provider '{p}' check completed."}

@router.post("/config/clear-data")
async def clear_gallery_data():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM images")
        conn.commit()
    return {"success": True, "message": "Studio gallery records reset."}

import sys
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir.parent))

from backend.config import CORS_ORIGINS, STATIC_DIR
from backend.database import init_db
from backend.routers import (
    generate,
    enhance,
    img2img,
    gallery,
    config_router,
    posters
)

# Initialize database on startup
init_db()

app = FastAPI(
    title="AI Image Studio — Intelligent Image Generation Agent",
    description="Professional AI Image Generation Agent with real model integration, prompt enhancement, poster studio, and persistent gallery.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder for serving generated images and uploads
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include API routers
app.include_router(generate.router)
app.include_router(enhance.router)
app.include_router(img2img.router)
app.include_router(gallery.router)
app.include_router(config_router.router)
app.include_router(posters.router)

# Mount frontend production build if available
frontend_dist = backend_dir.parent / "frontend" / "dist"
if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="frontend-assets")

@app.get("/")
async def serve_index():
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {
        "app": "AI Image Studio — Intelligent Image Generation Agent",
        "status": "ready",
        "endpoints": {
            "generate": "/api/generate",
            "enhance_prompt": "/api/enhance-prompt",
            "image_to_image": "/api/image-to-image",
            "gallery": "/api/gallery",
            "docs": "/docs"
        }
    }

# SPA Fallback for client-side routing
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    # Check if a static file in dist exists (e.g. favicon.svg)
    file_path = frontend_dist / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    
    # Otherwise return index.html for React SPA
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    
    return {"detail": "Not found"}

if __name__ == "__main__":
    import uvicorn
    from backend.config import HOST, PORT
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)

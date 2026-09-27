from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.services.image_to_image import save_uploaded_reference, process_image_to_image

router = APIRouter(prefix="/api", tags=["image-to-image"])

@router.post("/upload-reference")
async def upload_reference_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (PNG, JPG, WebP).")
    
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds maximum 10MB limit.")

    try:
        ref_data = save_uploaded_reference(file_bytes, file.filename or "reference.png")
        return {"success": True, "reference": ref_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process reference image: {str(e)}")

class ImageToImageRequest(BaseModel):
    reference_url: str
    transformation_prompt: str = Field(..., min_length=2)
    style: str = "Photorealistic"
    mode_type: str = "style_transfer"  # 'style_transfer', 'background_replacement', 'variation'
    strength: float = 0.75
    aspect_ratio: str = "1:1"
    provider: str = "pollinations"

@router.post("/image-to-image")
async def image_to_image_endpoint(req: ImageToImageRequest):
    if not req.transformation_prompt.strip():
        raise HTTPException(status_code=400, detail="Transformation prompt cannot be empty.")

    try:
        result = await process_image_to_image(
            reference_url=req.reference_url,
            transformation_prompt=req.transformation_prompt,
            style=req.style,
            mode_type=req.mode_type,
            strength=req.strength,
            aspect_ratio=req.aspect_ratio,
            provider=req.provider
        )
        return {"success": True, "image": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
import uuid
import base64
import io
from pathlib import Path
from typing import Dict, Any, Optional
from PIL import Image

from backend.config import STATIC_DIR, GENERATED_DIR
from backend.services.image_generator import generate_image_agent

UPLOADS_DIR = STATIC_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

def save_uploaded_reference(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Saves and analyzes user uploaded reference image for image-to-image workflows.
    """
    ext = Path(filename).suffix.lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".png"

    ref_id = f"ref_{uuid.uuid4().hex[:10]}"
    saved_filename = f"{ref_id}{ext}"
    saved_path = UPLOADS_DIR / saved_filename

    # Open image with PIL to validate
    img = Image.open(io.BytesIO(file_bytes))
    orig_w, orig_h = img.size
    
    # Calculate best matching aspect ratio
    ratio_val = orig_w / orig_h
    if 0.95 <= ratio_val <= 1.05:
        detected_ar = "1:1"
    elif ratio_val < 0.7:
        detected_ar = "9:16"
    elif ratio_val < 0.9:
        detected_ar = "4:5"
    elif ratio_val > 1.4:
        detected_ar = "16:9"
    else:
        detected_ar = "3:2"

    img.save(str(saved_path))

    return {
        "ref_id": ref_id,
        "filename": saved_filename,
        "url": f"/static/uploads/{saved_filename}",
        "width": orig_w,
        "height": orig_h,
        "aspect_ratio": detected_ar
    }

async def process_image_to_image(
    reference_url: str,
    transformation_prompt: str,
    style: str = "Photorealistic",
    mode_type: str = "style_transfer", # 'style_transfer', 'background_replacement', 'variation'
    strength: float = 0.75,
    aspect_ratio: str = "1:1",
    provider: str = "pollinations"
) -> Dict[str, Any]:
    """
    Executes image-to-image transformation pipeline.
    Combines reference conditioning with transformation prompts and style directives.
    """
    prefix = ""
    if mode_type == "style_transfer":
        prefix = f"Transform the aesthetic and artistic style of the subject to {style}. Maintain subject structure while applying: "
    elif mode_type == "background_replacement":
        prefix = f"Keep the foreground subject intact and seamlessly replace the entire background with: "
    elif mode_type == "variation":
        prefix = f"Generate an imaginative creative variation of this image subject in {style} style, featuring: "

    combined_prompt = f"{prefix}{transformation_prompt.strip()}. Rendered in high quality {style}, cinematic lighting, photorealistic textures."

    # Call generation agent with mode='img2img'
    generated_images = await generate_image_agent(
        prompt=combined_prompt,
        enhanced_prompt=None,
        style=style,
        aspect_ratio=aspect_ratio,
        provider=provider,
        count=1,
        mode="img2img"
    )

    if not generated_images:
        raise Exception("Image-to-image generation produced no output.")

    result = generated_images[0]
    result["reference_url"] = reference_url
    result["transformation_type"] = mode_type
    return result

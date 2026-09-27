import os
import uuid
import random
import urllib.parse
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import httpx
from PIL import Image
import io

from backend.config import (
    GENERATED_DIR,
    OPENAI_API_KEY,
    STABILITY_API_KEY,
    GEMINI_API_KEY,
    SUPPORTED_PROVIDERS
)
from backend.database import save_image_record

ASPECT_RATIO_DIMENSIONS = {
    "1:1": (1024, 1024),
    "4:5": (896, 1120),
    "9:16": (768, 1344),
    "16:9": (1344, 768),
    "3:2": (1200, 800),
    "2:3": (800, 1200)
}

def resolve_dimensions(aspect_ratio: str) -> tuple[int, int]:
    return ASPECT_RATIO_DIMENSIONS.get(aspect_ratio, (1024, 1024))

async def generate_with_pollinations(
    prompt: str,
    width: int,
    height: int,
    seed: int,
    model: str = "flux"
) -> bytes:
    """
    Generates real image via Pollinations AI (Flux / SDXL).
    """
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&seed={seed}&model={model}&nologo=true"
    
    headers = {
        "User-Agent": "AI-Image-Studio-Agent/1.0"
    }

    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Pollinations generation failed with status {response.status_code}: {response.text[:200]}")
        return response.content

async def generate_with_openai(
    prompt: str,
    aspect_ratio: str,
    quality: str = "standard"
) -> bytes:
    """
    Generates image via OpenAI DALL-E 3 if key is configured.
    """
    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API Key is missing. Please configure it in Settings or .env.")

    # DALL-E 3 supported sizes
    if aspect_ratio in ["9:16", "2:3", "4:5"]:
        size = "1024x1792"
    elif aspect_ratio in ["16:9", "3:2"]:
        size = "1792x1024"
    else:
        size = "1024x1024"

    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": "hd" if quality.lower() == "hd" else "standard",
        "response_format": "b64_json"
    }

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"OpenAI error: {response.text}")
        data = response.json()
        import base64
        b64_str = data["data"][0]["b64_json"]
        return base64.b64decode(b64_str)

async def generate_image_agent(
    prompt: str,
    enhanced_prompt: Optional[str] = None,
    style: str = "Photorealistic",
    aspect_ratio: str = "1:1",
    provider: str = "pollinations",
    model: Optional[str] = None,
    seed: Optional[int] = None,
    quality: str = "standard",
    count: int = 1,
    mode: str = "text2img"
) -> List[Dict[str, Any]]:
    """
    Core AI Image Generation Agent orchestration pipeline.
    Validates parameters, handles dispatch, persists images and returns structured records.
    """
    final_prompt = (enhanced_prompt.strip() if enhanced_prompt else prompt.strip())
    width, height = resolve_dimensions(aspect_ratio)
    
    selected_provider = provider.lower()
    if selected_provider not in SUPPORTED_PROVIDERS:
        selected_provider = "pollinations"

    active_model = model or ("flux" if selected_provider == "pollinations" else "dall-e-3")
    
    results = []

    for i in range(max(1, min(count, 4))):
        current_seed = (seed + i) if seed is not None and seed > 0 else random.randint(100000, 999999999)
        image_id = f"img_{uuid.uuid4().hex[:12]}"
        filename = f"{image_id}.png"
        filepath = GENERATED_DIR / filename

        image_bytes: Optional[bytes] = None

        if selected_provider == "openai":
            image_bytes = await generate_with_openai(final_prompt, aspect_ratio, quality)
        else:
            # Pollinations Flux/Turbo (default real model)
            image_bytes = await generate_with_pollinations(
                prompt=final_prompt,
                width=width,
                height=height,
                seed=current_seed,
                model=active_model
            )

        # Validate and optimize image through Pillow
        img = Image.open(io.BytesIO(image_bytes))
        img.save(str(filepath), format="PNG", optimize=True)

        record_data = {
            "id": image_id,
            "prompt": prompt,
            "enhanced_prompt": final_prompt if final_prompt != prompt else "",
            "style": style,
            "aspect_ratio": aspect_ratio,
            "width": width,
            "height": height,
            "image_url": f"/static/generated/{filename}",
            "file_path": str(filepath),
            "provider": selected_provider,
            "model": active_model,
            "seed": current_seed,
            "is_favorite": 0,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "mode": mode
        }

        saved_record = save_image_record(record_data)
        results.append(saved_record)

    return results

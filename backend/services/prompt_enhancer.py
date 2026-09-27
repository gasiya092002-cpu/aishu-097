import os
import re
import httpx
from typing import Dict, Any, Optional
from backend.config import GEMINI_API_KEY, OPENAI_API_KEY

STYLE_ENHANCEMENT_MODIFIERS = {
    "photorealistic": "8k resolution, photorealistic, cinematic shot, Hasselblad 100mm f/2.8 lens, natural lighting, hyperrealistic textures, ray tracing, sharp focus, stunning realism",
    "cinematic": "cinematic lighting, dramatic anamorphic widescreen lens, shallow depth of field, atmospheric haze, movie still, color graded, 35mm film grain, dynamic composition",
    "3d render": "Octane render, Unreal Engine 5, ray-traced shadows, subsurface scattering, ambient occlusion, polished 3D CGI masterpiece, ultra-detailed materials",
    "anime": "Makoto Shinkai aesthetic, vibrant anime art style, intricate cel shading, expressive atmospheric lighting, detailed background, crisp outlines, Studio Ghibli inspired",
    "cartoon": "playful modern cartoon illustration, clean vector curves, vibrant saturated color palette, whimsical lighting, expressive character design, smooth shading",
    "digital art": "concept art, trending on ArtStation, dynamic brushwork, vivid color harmony, intricate details, epic scale, masterpiece digital painting",
    "fantasy": "ethereal fantasy aesthetic, mystical glowing particles, magical volumetric atmosphere, enchanted lighting, high fantasy art, majestic and ornate details",
    "cyberpunk": "neon-drenched cityscape, holographic reflections, wet asphalt reflection, high-tech cybernetic accents, synthwave aesthetic, futuristic volumetric glow",
    "watercolor": "delicate watercolor on textured cold-press paper, soft fluid washes, pigment bleeds, organic splatters, painterly aesthetic, pastel and translucent tones",
    "oil painting": "rich impasto oil painting on canvas, visible expressive palette knife strokes, classical chiaroscuro lighting, textured oil glaze, fine art masterpiece",
    "minimalist": "minimalist aesthetic, clean negative space, subtle geometric harmony, refined color palette, quiet elegance, balanced composition, contemporary simplicity",
    "product photography": "commercial studio product shot, softbox diffused lighting, crisp clean background, premium reflection, 8k resolution, razor sharp product detail",
    "architecture": "architectural photography, brutalist and modern parametric lines, dramatic shadows, wide angle lens, structural symmetry, ambient daylight",
    "nature photography": "National Geographic style wildlife and nature photography, golden hour sunlight, lush environmental depth, telephoto lens bokeh, vivid natural textures"
}

LIGHTING_OPTIONS = [
    "cinematic golden hour rim lighting",
    "dramatic volumetric god rays piercing through atmosphere",
    "soft diffused studio softbox lighting",
    "neon accent backlighting with subtle reflections",
    "moody twilight chiaroscuro illumination"
]

COMPOSITION_OPTIONS = [
    "rule of thirds composition with deep atmospheric depth",
    "low-angle heroic perspective emphasizing grand scale",
    "dynamic wide-angle panoramic framing",
    "intimate close-up portrait with creamy bokeh background",
    "balanced symmetrical composition with leading visual lines"
]

def analyze_prompt_heuristic(raw_prompt: str, style: str = "photorealistic") -> Dict[str, Any]:
    """
    Intelligent rule-based prompt enhancement engine that inspects subject,
    identifies context, and builds a cinematic prompt preserving original intent.
    """
    clean_prompt = raw_prompt.strip().rstrip(".")
    if not clean_prompt:
        return {
            "original_prompt": "",
            "enhanced_prompt": "",
            "subject": "",
            "style_applied": style,
            "lighting": "",
            "composition": "",
            "modifiers": []
        }

    # Extract primary subject
    subject_match = re.sub(r'^(a|an|the|picture of|image of|photo of)\s+', '', clean_prompt, flags=re.IGNORECASE)
    subject = subject_match.strip()

    # Determine optimal style preset
    style_key = style.lower().strip()
    style_phrase = STYLE_ENHANCEMENT_MODIFIERS.get(style_key, STYLE_ENHANCEMENT_MODIFIERS["photorealistic"])

    # Determine lighting & composition based on prompt contents
    if "night" in clean_prompt.lower() or "dark" in clean_prompt.lower() or "cyber" in clean_prompt.lower():
        lighting = "neon atmospheric rim lighting, deep cinematic contrast, vibrant reflections"
    elif "sun" in clean_prompt.lower() or "nature" in clean_prompt.lower() or "outdoor" in clean_prompt.lower():
        lighting = "warm golden hour radiance, soft natural sun flare, volumetric atmosphere"
    else:
        lighting = "cinematic directional lighting, soft ambient fill, balanced highlights"

    if "portrait" in clean_prompt.lower() or "face" in clean_prompt.lower() or "person" in clean_prompt.lower() or "robot" in clean_prompt.lower():
        composition = "centered character portrait, shallow depth of field, creamy background bokeh, sharp eye focus"
    elif "city" in clean_prompt.lower() or "landscape" in clean_prompt.lower() or "building" in clean_prompt.lower():
        composition = "sweeping wide-angle cinematic perspective, atmospheric depth, majestic scale"
    else:
        composition = "dynamic heroic composition, intricate foreground details, balanced atmospheric perspective"

    # Assemble enhanced prompt
    enhanced = f"A highly detailed, visually stunning depiction of {subject}, {lighting}, {composition}, {style_phrase}, ultra-detailed, masterwork"

    return {
        "original_prompt": raw_prompt,
        "enhanced_prompt": enhanced,
        "subject": subject,
        "style_applied": style,
        "lighting": lighting,
        "composition": composition,
        "modifiers": [item.strip() for item in style_phrase.split(",")[:4]]
    }

async def enhance_prompt_with_llm(raw_prompt: str, style: str = "photorealistic") -> Dict[str, Any]:
    """
    Enhances prompt using configured LLM (Gemini or OpenAI) with graceful fallback to heuristic engine.
    """
    # 1. Try Google Gemini if GEMINI_API_KEY is configured
    if GEMINI_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                prompt_instruction = f"""
You are an expert AI prompt engineer for text-to-image diffusion models (Flux, Midjourney, Stable Diffusion).
Transform this user prompt into a high-fidelity, visually breathtaking image prompt.

User Prompt: "{raw_prompt}"
Target Style: "{style}"

Rules:
1. Preserve the original subject and core intention precisely.
2. Add rich visual details: specific lighting, color palette, camera lens, perspective, and textural composition.
3. Align with the requested style '{style}'.
4. Avoid filler words like 'please generate' or quotes. Return ONLY the enhanced prompt string.
"""
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt_instruction}]
                    }]
                }
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    enhanced_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    heuristic = analyze_prompt_heuristic(raw_prompt, style)
                    heuristic["enhanced_prompt"] = enhanced_text
                    heuristic["llm_provider"] = "Gemini"
                    return heuristic
        except Exception as e:
            print(f"[PromptEnhancer] Gemini LLM enhancement error: {e}")

    # 2. Try OpenAI if OPENAI_API_KEY is configured
    if OPENAI_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a master image prompt engineer. Enhance user prompts for image generation with rich sensory details, lighting, camera settings, and style. Return only the enhanced prompt without commentary."
                        },
                        {
                            "role": "user",
                            "content": f"User Prompt: {raw_prompt}\nTarget Style: {style}"
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 150
                }
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    enhanced_text = data["choices"][0]["message"]["content"].strip()
                    heuristic = analyze_prompt_heuristic(raw_prompt, style)
                    heuristic["enhanced_prompt"] = enhanced_text
                    heuristic["llm_provider"] = "OpenAI"
                    return heuristic
        except Exception as e:
            print(f"[PromptEnhancer] OpenAI LLM enhancement error: {e}")

    # 3. Fallback to our intelligent heuristic engine
    result = analyze_prompt_heuristic(raw_prompt, style)
    result["llm_provider"] = "AI Studio Heuristic Engine"
    return result

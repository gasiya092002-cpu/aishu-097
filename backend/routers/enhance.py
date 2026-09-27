from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from backend.services.prompt_enhancer import enhance_prompt_with_llm

router = APIRouter(prefix="/api", tags=["enhance"])

class EnhanceRequest(BaseModel):
    prompt: str = Field(..., min_length=2, description="Original user prompt to improve")
    style: Optional[str] = "Photorealistic"

class EnhanceResponse(BaseModel):
    success: bool
    original_prompt: str
    enhanced_prompt: str
    subject: str
    style_applied: str
    lighting: str
    composition: str
    modifiers: List[str]
    llm_provider: str

@router.post("/enhance-prompt", response_model=EnhanceResponse)
async def enhance_prompt_endpoint(req: EnhanceRequest):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt must not be empty.")

    try:
        result = await enhance_prompt_with_llm(req.prompt, req.style or "Photorealistic")
        return EnhanceResponse(
            success=True,
            original_prompt=result["original_prompt"],
            enhanced_prompt=result["enhanced_prompt"],
            subject=result["subject"],
            style_applied=result["style_applied"],
            lighting=result["lighting"],
            composition=result["composition"],
            modifiers=result["modifiers"],
            llm_provider=result.get("llm_provider", "AI Studio Heuristic")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

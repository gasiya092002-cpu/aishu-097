from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/posters", tags=["posters"])

POSTER_PRESETS = [
    {
        "id": "instagram_poster",
        "title": "Instagram Creative Poster",
        "platform": "Instagram",
        "aspect_ratio": "4:5",
        "dimensions": "1080 x 1350 px",
        "recommended_style": "Digital Art",
        "template_headline": "INNOVATION SUMMIT 2026",
        "template_subtext": "Shaping the Future of Intelligent Systems",
        "badge_text": "REGISTER NOW",
        "description": "Optimized vertical layout designed for high engagement in Instagram feeds."
    },
    {
        "id": "whatsapp_status",
        "title": "WhatsApp & Story Poster",
        "platform": "WhatsApp / Stories",
        "aspect_ratio": "9:16",
        "dimensions": "1080 x 1920 px",
        "recommended_style": "Cyberpunk",
        "template_headline": "FLASH SALE TODAY",
        "template_subtext": "Exclusive 50% Off On All AI Design Tools",
        "badge_text": "SWIPE UP / TAP HERE",
        "description": "Full-screen vertical canvas with designated safe zones for text overlays."
    },
    {
        "id": "linkedin_banner",
        "title": "LinkedIn Professional Poster",
        "platform": "LinkedIn",
        "aspect_ratio": "16:9",
        "dimensions": "1200 x 675 px",
        "recommended_style": "Minimalist",
        "template_headline": "AI & WORKFORCE EVOLUTION",
        "template_subtext": "Executive Insights and Strategic Frameworks",
        "badge_text": "DOWNLOAD WHITE PAPER",
        "description": "Clean, authoritative horizontal banner ideal for corporate and tech announcements."
    },
    {
        "id": "event_poster",
        "title": "Music & Tech Event Poster",
        "platform": "Event / Print",
        "aspect_ratio": "4:5",
        "dimensions": "1080 x 1350 px",
        "recommended_style": "Cinematic",
        "template_headline": "NEON HORIZON FESTIVAL",
        "template_subtext": "Live Electronic Visuals & AI Orchestrations",
        "badge_text": "OCTOBER 15 • GRAND ARENA",
        "description": "Dramatic atmospheric poster with ample negative space for headliner details."
    },
    {
        "id": "infographic",
        "title": "Educational Infographic Concept",
        "platform": "Education / Editorial",
        "aspect_ratio": "2:3",
        "dimensions": "800 x 1200 px",
        "recommended_style": "3D Render",
        "template_headline": "NEURAL NETWORK MECHANICS",
        "template_subtext": "Visualizing Attention Layers and Diffusion Flows",
        "badge_text": "EXPLAINED STEP BY STEP",
        "description": "Structured informational visual backdrop with clear hierarchical sections."
    },
    {
        "id": "promotional",
        "title": "Product Promotional Card",
        "platform": "Omnichannel",
        "aspect_ratio": "1:1",
        "dimensions": "1024 x 1024 px",
        "recommended_style": "Product Photography",
        "template_headline": "EXPERIENCE SOUND REDEFINED",
        "template_subtext": "Acoustic Noise-Canceling Wireless Headphones",
        "badge_text": "SPECIAL LAUNCH EDITION",
        "description": "Balanced square card spotlighting product elegance and modern typography."
    },
    {
        "id": "ai_technology",
        "title": "AI Technology & Research Poster",
        "platform": "Conference / Tech",
        "aspect_ratio": "16:9",
        "dimensions": "1344 x 768 px",
        "recommended_style": "Cyberpunk",
        "template_headline": "DEEP LEARNING FRONTIERS",
        "template_subtext": "Autonomous Reasoning and Agentic Workflows",
        "badge_text": "RESEARCH PAPER RELEASE",
        "description": "High-tech aesthetic with neural connections and glowing geometric data ribbons."
    },
    {
        "id": "business_announcement",
        "title": "Corporate & Business Poster",
        "platform": "Business / B2B",
        "aspect_ratio": "4:5",
        "dimensions": "1080 x 1350 px",
        "recommended_style": "Architecture",
        "template_headline": "GLOBAL EXPANSION 2026",
        "template_subtext": "Bridging Enterprises Across 45 Countries",
        "badge_text": "ANNUAL MILESTONE",
        "description": "Sophisticated architectural lines symbolizing growth, stability, and vision."
    }
]

@router.get("/presets")
async def get_poster_presets():
    return {"presets": POSTER_PRESETS}

class PosterPromptRequest(BaseModel):
    category: str
    headline: str
    subtext: Optional[str] = ""
    topic: str
    mood: Optional[str] = "Modern & Sleek"

@router.post("/build-prompt")
async def build_poster_prompt(req: PosterPromptRequest):
    """
    Intelligent prompt builder that creates an ideal graphic design background
    with negative space suited for high-clarity typography overlays.
    """
    base = f"A professional graphic design poster background for '{req.topic}', theme: {req.mood}."
    composition = "Spacious layout with clean negative space specifically designed for text overlays, balanced visual elements, subtle gradient depth, ultra high resolution."
    full_prompt = f"{base} {composition}"
    return {
        "success": True,
        "poster_background_prompt": full_prompt,
        "headline": req.headline,
        "subtext": req.subtext
    }

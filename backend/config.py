import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory or project root
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent

load_dotenv(backend_dir / ".env")
load_dotenv(project_root / ".env")

# Directories
BASE_DIR = backend_dir
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"
GENERATED_DIR = STATIC_DIR / "generated"

DATA_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "images.db"

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY", "")

# Server Settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

# Providers
DEFAULT_IMAGE_PROVIDER = "pollinations"
SUPPORTED_PROVIDERS = {
    "pollinations": {
        "name": "Pollinations AI (Flux / SDXL)",
        "requires_key": False,
        "is_active": True,
        "models": ["flux", "turbo"],
        "description": "High-speed modern Flux & SDXL models with no API key requirement."
    },
    "openai": {
        "name": "OpenAI DALL-E 3",
        "requires_key": True,
        "is_active": bool(OPENAI_API_KEY),
        "models": ["dall-e-3", "dall-e-2"],
        "description": "State-of-the-art prompt fidelity and photorealism by OpenAI."
    },
    "stability": {
        "name": "Stability AI (SD3 / Core)",
        "requires_key": True,
        "is_active": bool(STABILITY_API_KEY),
        "models": ["stable-diffusion-3-medium", "core"],
        "description": "High resolution artistic and concept renderings."
    },
    "gemini": {
        "name": "Google Gemini (Imagen 3)",
        "requires_key": True,
        "is_active": bool(GEMINI_API_KEY),
        "models": ["imagen-3.0-generate-002"],
        "description": "Google DeepMind Imagen 3 generative engine."
    }
}

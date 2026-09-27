# AI Image Studio — Intelligent Image Generation Agent

![AI Image Studio Banner](https://img.shields.io/badge/AI%20Image%20Studio-Agent%202.0-39FF88?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.14-0B1020?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React%2019-TypeScript-3B82F6?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38BDF8?style=for-the-badge&logo=tailwindcss)

A complete, modern, full-stack AI Image Generation Agent web application built from scratch. Features an intelligent multi-step agent workflow, prompt enhancement, style synthesis, image-to-image conditioning, an interactive AI poster typography studio, and persistent SQLite gallery storage.

---

## 🎨 Design & Palette

- **Deep Navy**: `#0B1020`
- **Electric Blue**: `#3B82F6`
- **Neon Green**: `#39FF88`
- **Dark Surface**: `#151C2C`
- **Soft Gray**: `#94A3B8`
- **White**: `#F8FAFC`

Modern dark-themed glassmorphism interface with subtle glowing buttons, responsive desktop & mobile layouts, and animated AI agent workflow progression.

---

## 🚀 Key Features

### 1. Intelligent AI Image Generation
- **Text-to-Image**: Generates high-resolution images from natural language descriptions.
- **Aspect Ratios**: Full support for `1:1` (Square), `4:5` (Instagram Portrait), `9:16` (Story/Reel), `16:9` (Landscape/YouTube), `3:2` (DSLR Photography), and `2:3` (Editorial/Poster).
- **Batch Variations**: Generate 1, 2, or 4 images simultaneously.
- **Parameters**: Seed control, negative prompts, quality presets (Standard / HD).
- **Out-of-the-Box Functionality**: Defaults to Pollinations AI (Flux / SDXL), so image generation works immediately upon spinning up without requiring paid API keys or credit cards!

### 2. AI Prompt Enhancer
- Analyzes semantic intent, extracts primary subjects, and synthesizes cinematic lighting, camera perspective (e.g. 85mm f/1.4, tilt-shift, volumetric atmosphere), and style modifiers while preserving original meaning.
- **Side-by-Side Diff Modal**: Compares the original prompt with the enhanced prompt, displays visual breakdowns, and allows editing before applying.
- **Multi-Engine Support**: Uses Google Gemini or OpenAI LLMs when configured, with an intelligent built-in heuristic expansion engine as default.

### 3. Visual Style Selector
Provides 14 custom visual style cards with badges and icons:
1. Photorealistic (8K razor-sharp reality)
2. Cinematic (35mm anamorphic widescreen)
3. 3D Render (Octane & Unreal Engine 5)
4. Anime (Makoto Shinkai & Ghibli aesthetic)
5. Cartoon (Playful vector illustration)
6. Digital Art (ArtStation concept art)
7. Fantasy (Enchanted realms & glowing particles)
8. Cyberpunk (Neon nightscapes & rain reflections)
9. Watercolor (Fluid pigment washes on textured paper)
10. Oil Painting (Impasto brushwork & chiaroscuro)
11. Minimalist (Geometric balance & negative space)
12. Product Photography (Commercial studio softbox)
13. Architecture (Brutalist parametric lines & ambient daylight)
14. Nature Photography (National Geographic wildlife & macro)

### 4. Image-to-Image Studio
- Upload reference pictures (JPG, PNG, WebP up to 10MB).
- Select transformation objective:
  - **Style Transfer**: Converts art style (e.g., photo to anime, sketch to 3D).
  - **Background Replacement**: Keeps foreground subject, alters environment.
  - **Creative Variation**: Generates re-imagined details.
- Conditioning strength slider (30% to 95%).
- Side-by-side comparison between original and transformed image.

### 5. AI Poster Studio & Interactive Canvas Text Overlay
- Dedicated poster generator for Instagram, WhatsApp Stories, LinkedIn, Events, Infographics, Promotional, AI Technology, and Corporate announcements.
- Structured prompt assistant that creates clean negative space tailored for typography.
- **Integrated Canvas Typography Editor**:
  - Live preview with customizable Headline, Subtitle, and Pill Badges.
  - Color pickers, font sizing sliders, vertical position sliders, and drop-shadow toggles.
  - One-click export to composite high-res PNG file with crisp, legible text!

### 6. Studio Gallery & Asset Management
- Real-time persistent storage in SQLite (`backend/data/images.db`) and local disk caching (`backend/static/generated/`).
- Full-screen high-res Lightbox modal with zoom in/out controls.
- Keyword prompt search, filter by style, filter by favorites, sort by date.
- One-click actions: Download PNG, Copy Prompt, Favorite, Regenerate, Delete.

### 7. AI Agent Execution Pipeline
Visualizes the 5 execution steps in real-time during generation:
1. **Prompt Analysis**: Semantic intent and context token extraction.
2. **Visual Enhancement**: Camera optics and lighting modifiers synthesis.
3. **Model Validation**: Aspect ratio and model parameter check.
4. **Neural Diffusion Dispatch**: Tensor generation via diffusion engine.
5. **Studio Persistence**: Image optimization and SQLite indexing.

---

## 🏗️ Architecture & Project Structure

```
c:\aishu-097\
├── backend/
│   ├── config.py                 # App settings, paths, and API keys
│   ├── database.py               # SQLite ORM & CRUD helpers
│   ├── main.py                   # FastAPI server entrypoint & CORS
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   └── images.db             # Persistent SQLite database
│   ├── static/
│   │   ├── generated/            # Local generated PNG storage
│   │   └── uploads/              # Uploaded reference images
│   ├── routers/
│   │   ├── config_router.py      # /api/config & /api/health
│   │   ├── enhance.py            # /api/enhance-prompt
│   │   ├── gallery.py            # /api/gallery endpoints
│   │   ├── generate.py           # /api/generate endpoint
│   │   ├── img2img.py            # /api/image-to-image
│   │   └── posters.py            # /api/posters presets & assistant
│   └── services/
│       ├── image_generator.py    # Multi-provider generation service
│       ├── image_to_image.py     # Reference conditioning pipeline
│       └── prompt_enhancer.py    # Heuristic & LLM prompt enhancement
├── frontend/
│   ├── index.html                # HTML5 entry with Plus Jakarta Sans
│   ├── package.json              # React 19 & Vite dependencies
│   ├── tailwind.config.js        # Custom palette & glassmorphism theme
│   ├── vite.config.ts            # Vite config with backend proxy
│   └── src/
│       ├── App.tsx               # Primary tab router & global state
│       ├── components/
│       │   ├── AgentWorkflowVisualizer.tsx
│       │   ├── AspectRatioSelector.tsx
│       │   ├── Footer.tsx
│       │   ├── ImageCard.tsx
│       │   ├── LightboxModal.tsx
│       │   ├── Navbar.tsx
│       │   ├── PromptDiffModal.tsx
│       │   ├── StyleSelector.tsx
│       │   └── TextOverlayEditor.tsx
│       ├── pages/
│       │   ├── GalleryPage.tsx
│       │   ├── GeneratorPage.tsx
│       │   ├── HomePage.tsx
│       │   ├── ImageToImagePage.tsx
│       │   ├── PosterStudioPage.tsx
│       │   └── SettingsPage.tsx
│       ├── services/
│       │   └── api.ts            # Typed REST API client
│       └── types/
│           └── index.ts          # TypeScript type definitions
└── .env.example                  # Environment variables template
```

---

## ⚙️ Quickstart & Local Setup

### Prerequisites
- Node.js (v18+) and npm
- Python 3.10+ (tested on Python 3.14)

### 1. Install Backend Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables (Optional)
The application works immediately out-of-the-box using the built-in Pollinations AI Flux engine. To enable OpenAI DALL-E 3 or Google Gemini prompt enhancement, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set any optional API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
STABILITY_API_KEY=your_stability_api_key_here
```

### 3. Run Backend Server
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Backend API will be live at `http://127.0.0.1:8000`. Swagger API docs available at `http://127.0.0.1:8000/docs`.

### 4. Run Frontend Client
In a separate terminal window:
```bash
cd frontend
npm run dev
```
Open your browser at `http://127.0.0.1:5173`.

---

## 🔒 Security & Privacy

- **API Keys are isolated on the server**: Keys are loaded via server-side environment variables and are never bundled, transmitted, or stored in frontend `localStorage`.
- **Upload Validation**: Image uploads are validated with file type restrictions (PNG, JPG, WebP) and a 10MB size limit.
- **Disk Persistence**: Generated assets and uploaded references are sanitized and stored locally in `backend/static/` with SQLite metadata.

---

## 🚢 Production Deployment

### Backend (Docker / Render / Railway / Fly.io)
Deploy using Docker or a Python WSGI/ASGI service:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Vercel / Netlify / Cloudflare Pages)
Build production static assets:
```bash
cd frontend
npm run build
```
Deploy the generated `frontend/dist` folder. Configure your reverse proxy to route `/api` and `/static` requests to the deployed backend service.

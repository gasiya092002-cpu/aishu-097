import React, { useState, useEffect, useRef } from 'react';
import { Type, Download, Move, Palette, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface TextOverlayEditorProps {
  imageUrl: string;
  defaultHeadline?: string;
  defaultSubtext?: string;
  defaultBadge?: string;
}

export const TextOverlayEditor: React.FC<TextOverlayEditorProps> = ({
  imageUrl,
  defaultHeadline = 'AI INNOVATION SUMMIT 2026',
  defaultSubtext = 'Exploring the Frontiers of Autonomous Intelligence',
  defaultBadge = 'OCTOBER 24 • TECH ARENA'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Layer States
  const [headline, setHeadline] = useState(defaultHeadline);
  const [headlineSize, setHeadlineSize] = useState(48);
  const [headlineColor, setHeadlineColor] = useState('#FFFFFF');
  const [headlineY, setHeadlineY] = useState(25); // percentage from top

  const [subtext, setSubtext] = useState(defaultSubtext);
  const [subtextSize, setSubtextSize] = useState(22);
  const [subtextColor, setSubtextColor] = useState('#94A3B8');
  const [subtextY, setSubtextY] = useState(38);

  const [badge, setBadge] = useState(defaultBadge);
  const [badgeBg, setBadgeBg] = useState('#3B82F6');
  const [badgeTextColor, setBadgeTextColor] = useState('#FFFFFF');
  const [badgeY, setBadgeY] = useState(15);

  const [hasShadow, setHasShadow] = useState(true);

  // Redraw canvas whenever layers update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas dimensions matching the original image
      canvas.width = img.naturalWidth || 1080;
      canvas.height = img.naturalHeight || 1350;

      // Draw background image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Optional text drop shadow for legibility
      if (hasShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      // Draw Badge (Pill button)
      if (badge && badge.trim()) {
        ctx.save();
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        const textWidth = ctx.measureText(badge.toUpperCase()).width;
        const pillWidth = textWidth + 36;
        const pillHeight = 44;
        const pillX = (canvas.width - pillWidth) / 2;
        const pillY = (canvas.height * (badgeY / 100)) - (pillHeight / 2);

        // Draw pill background
        ctx.fillStyle = badgeBg;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
        ctx.fill();

        // Draw pill text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = badgeTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badge.toUpperCase(), canvas.width / 2, pillY + (pillHeight / 2));
        ctx.restore();
      }

      // Draw Headline
      if (headline && headline.trim()) {
        ctx.save();
        if (hasShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 6;
        }
        ctx.font = `800 ${headlineSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = headlineColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Multi-line wrap
        const words = headline.split(' ');
        let line = '';
        const lines: string[] = [];
        const maxWidth = canvas.width * 0.85;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = headlineSize * 1.15;
        const startY = (canvas.height * (headlineY / 100)) - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((l, index) => {
          ctx.fillText(l.trim(), canvas.width / 2, startY + (index * lineHeight));
        });
        ctx.restore();
      }

      // Draw Subtext
      if (subtext && subtext.trim()) {
        ctx.save();
        if (hasShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 3;
        }
        ctx.font = `500 ${subtextSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = subtextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Multi-line wrap
        const words = subtext.split(' ');
        let line = '';
        const lines: string[] = [];
        const maxWidth = canvas.width * 0.80;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = subtextSize * 1.35;
        const startY = (canvas.height * (subtextY / 100));

        lines.forEach((l, index) => {
          ctx.fillText(l.trim(), canvas.width / 2, startY + (index * lineHeight));
        });
        ctx.restore();
      }
    };
  }, [
    imageUrl, headline, headlineSize, headlineColor, headlineY,
    subtext, subtextSize, subtextColor, subtextY,
    badge, badgeBg, badgeTextColor, badgeY, hasShadow
  ]);

  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ai-poster-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Canvas Live Preview */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center glass-panel p-4 rounded-2xl border border-electric/30 shadow-2xl">
        <div className="relative max-h-[640px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-navy-950">
          <canvas
            ref={canvasRef}
            className="max-h-[600px] max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-between w-full mt-4 px-2">
          <span className="text-xs text-soft-dim font-mono">Live Composite Canvas Renderer</span>
          <button
            onClick={handleDownloadPoster}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric to-neon-green text-navy-950 font-extrabold text-sm shadow-glow-neon hover:opacity-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Complete Poster PNG
          </button>
        </div>
      </div>

      {/* Typography & Badge Controls */}
      <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-surface-border space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-electric" />
            Poster Text & Typography Controls
          </h3>
          <span className="text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/30">
            Vector Typography
          </span>
        </div>

        {/* Badge Pill Setting */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface-dark border border-surface-border">
          <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center justify-between">
            <span>Badge / Event Label</span>
            <span className="text-[10px] text-soft-dim">Pill Accent</span>
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            placeholder="e.g. OCTOBER 24 • ARENA"
          />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Badge Color</span>
              <div className="flex gap-1.5">
                {['#3B82F6', '#39FF88', '#EF4444', '#F59E0B', '#111827'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBadgeBg(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border ${badgeBg === c ? 'border-white scale-110' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Vertical Position ({badgeY}%)</span>
              <input
                type="range"
                min="5"
                max="90"
                value={badgeY}
                onChange={(e) => setBadgeY(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
          </div>
        </div>

        {/* Main Headline Setting */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface-dark border border-surface-border">
          <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center justify-between">
            <span>Main Headline</span>
            <span className="text-[10px] text-soft-dim">Size: {headlineSize}px</span>
          </label>
          <textarea
            rows={2}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric resize-none"
            placeholder="Main poster title..."
          />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Font Size</span>
              <input
                type="range"
                min="24"
                max="80"
                value={headlineSize}
                onChange={(e) => setHeadlineSize(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Vertical Position ({headlineY}%)</span>
              <input
                type="range"
                min="10"
                max="85"
                value={headlineY}
                onChange={(e) => setHeadlineY(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[10px] text-soft-dim">Headline Color:</span>
            {['#FFFFFF', '#39FF88', '#3B82F6', '#FDE047', '#F43F5E'].map((c) => (
              <button
                key={c}
                onClick={() => setHeadlineColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full border ${headlineColor === c ? 'border-white scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        {/* Subtitle / Tagline Setting */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface-dark border border-surface-border">
          <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center justify-between">
            <span>Subtitle / Tagline</span>
            <span className="text-[10px] text-soft-dim">Size: {subtextSize}px</span>
          </label>
          <textarea
            rows={2}
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric resize-none"
            placeholder="Subtitle description..."
          />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Font Size</span>
              <input
                type="range"
                min="14"
                max="40"
                value={subtextSize}
                onChange={(e) => setSubtextSize(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
            <div>
              <span className="text-[10px] text-soft-dim block mb-1">Vertical Position ({subtextY}%)</span>
              <input
                type="range"
                min="15"
                max="95"
                value={subtextY}
                onChange={(e) => setSubtextY(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
          </div>
        </div>

        {/* Toggle Shadow */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-dark/60 border border-surface-border text-xs">
          <span className="text-soft-gray">Text Drop Shadow (Enhances Readability)</span>
          <input
            type="checkbox"
            checked={hasShadow}
            onChange={(e) => setHasShadow(e.target.checked)}
            className="w-4 h-4 accent-electric rounded cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
};

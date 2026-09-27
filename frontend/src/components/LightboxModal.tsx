import React, { useState } from 'react';
import { 
  X, Download, Heart, Copy, Check, Trash2, 
  Sparkles, RefreshCw, ZoomIn, ZoomOut, Layers, Calendar, Cpu, Tag 
} from 'lucide-react';
import { GeneratedImage } from '../types';

interface LightboxModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  onClose,
  onToggleFavorite,
  onDelete,
  onRegenerate,
  onVariation
}) => {
  if (!image) return null;

  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.enhanced_prompt || image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.image_url;
    link.download = `${image.id || 'ai-image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-xl p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Top Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-surface-dark/80 hover:bg-surface-card border border-surface-border text-white hover:text-red-400 transition-all shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full max-w-6xl h-[92vh] glass-panel rounded-2xl border border-surface-border overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* Left: Image Canvas Viewport */}
        <div className="flex-1 bg-navy-950 flex flex-col items-center justify-center relative p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-surface-border">
          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-surface-dark/80 backdrop-blur-md border border-surface-border text-white">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
              className="p-1.5 hover:bg-surface-card rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1.5 hover:bg-surface-card rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="text-[10px] px-2 py-1 bg-surface-card hover:bg-surface-lighter rounded-md transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
            <img
              src={image.image_url}
              alt={image.prompt}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-200"
            />
          </div>
        </div>

        {/* Right: Metadata & Action Sidebar */}
        <div className="w-full lg:w-96 flex flex-col justify-between bg-surface-dark/95 p-6 overflow-y-auto space-y-6">
          
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2.5 py-1 rounded-md border border-neon-green/30">
                {image.aspect_ratio} • {image.width}x{image.height}px
              </span>
              <button
                onClick={() => onToggleFavorite(image.id)}
                className={`p-2 rounded-xl border transition-all ${
                  image.is_favorite
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-neon'
                    : 'bg-surface-card text-soft-dim border-surface-border hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${image.is_favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Prompt details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-soft-light uppercase tracking-wider">
                  Original Prompt
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] text-electric-glow hover:underline"
                >
                  {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-slate-200 p-3 rounded-xl bg-navy-950/70 border border-surface-border leading-relaxed max-h-28 overflow-y-auto">
                {image.prompt}
              </p>
            </div>

            {/* Enhanced Prompt (if available) */}
            {image.enhanced_prompt && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-neon-green uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Enhanced Prompt
                </label>
                <p className="text-xs text-soft-light p-3 rounded-xl bg-surface-card border border-neon-green/30 leading-relaxed max-h-36 overflow-y-auto">
                  {image.enhanced_prompt}
                </p>
              </div>
            )}

            {/* Technical Metadata Specs */}
            <div className="space-y-2.5 pt-2 border-t border-surface-border/60">
              <h4 className="text-xs font-semibold text-soft-dim uppercase tracking-wider">Parameters</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-navy-950/50 border border-surface-border">
                  <span className="text-soft-dim flex items-center gap-1 text-[11px] mb-0.5">
                    <Tag className="w-3 h-3 text-electric" /> Style
                  </span>
                  <p className="font-semibold text-white truncate">{image.style || 'Custom'}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-950/50 border border-surface-border">
                  <span className="text-soft-dim flex items-center gap-1 text-[11px] mb-0.5">
                    <Cpu className="w-3 h-3 text-purple-400" /> Engine
                  </span>
                  <p className="font-semibold text-white truncate capitalize">{image.provider || 'Pollinations'}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-950/50 border border-surface-border">
                  <span className="text-soft-dim text-[11px] mb-0.5">Seed Number</span>
                  <p className="font-mono text-neon-green font-semibold truncate">{image.seed || 'Random'}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-950/50 border border-surface-border">
                  <span className="text-soft-dim flex items-center gap-1 text-[11px] mb-0.5">
                    <Calendar className="w-3 h-3" /> Created
                  </span>
                  <p className="text-soft-light text-[11px] truncate">
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="space-y-2.5 pt-4 border-t border-surface-border">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-electric to-electric-deep text-white font-bold text-sm shadow-glow-blue hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Full Resolution PNG
            </button>

            <div className="grid grid-cols-2 gap-2">
              {onRegenerate && (
                <button
                  onClick={() => {
                    onRegenerate(image);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-card hover:bg-surface-lighter border border-surface-border text-white text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-electric-glow" />
                  Regenerate
                </button>
              )}
              {onVariation && (
                <button
                  onClick={() => {
                    onVariation(image);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-card hover:bg-surface-lighter border border-surface-border text-white text-xs font-medium transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-neon-green" />
                  Variations
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete this generated image?')) {
                  onDelete(image.id);
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-soft-dim hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete from Studio Gallery
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

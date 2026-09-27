import React, { useState } from 'react';
import { Download, Heart, Eye, Copy, Check, Trash2, Sparkles, Layers } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  onView: (image: GeneratedImage) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onUseAsReference?: (image: GeneratedImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onView,
  onToggleFavorite,
  onDelete,
  onUseAsReference
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.enhanced_prompt || image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.image_url;
    link.download = `${image.id || 'ai-image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this image from gallery?')) {
      onDelete(image.id);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(image.id);
  };

  return (
    <div 
      onClick={() => onView(image)}
      className="group relative rounded-2xl overflow-hidden glass-card glass-card-hover cursor-pointer border border-surface-border bg-surface-dark flex flex-col"
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-square bg-navy-950/80 overflow-hidden flex items-center justify-center">
        <img
          src={image.image_url}
          alt={image.prompt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Icon (Always visible if favorited, or visible on hover) */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            image.is_favorite
              ? 'bg-rose-500/80 text-white shadow-glow-neon scale-100'
              : 'bg-navy-950/70 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-400'
          }`}
          title="Favorite Image"
        >
          <Heart className={`w-4 h-4 ${image.is_favorite ? 'fill-white' : ''}`} />
        </button>

        {/* Style & Aspect Ratio Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-navy-950/80 backdrop-blur-md text-neon-green border border-neon-green/30">
            {image.style || 'Studio'}
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-navy-950/80 backdrop-blur-md text-soft-light border border-surface-border">
            {image.aspect_ratio}
          </span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                title="Download PNG"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                title="Copy Prompt"
              >
                {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
              </button>
              {onUseAsReference && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseAsReference(image);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                  title="Use in Image-to-Image"
                >
                  <Layers className="w-4 h-4 text-electric-glow" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 backdrop-blur-md transition-colors"
                title="Delete Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onView(image)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-electric text-white text-xs font-semibold shadow-glow-blue hover:brightness-110 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Details */}
      <div className="p-3 bg-surface-card flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {image.prompt}
        </p>
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-border text-[10px] text-soft-dim font-mono">
          <span className="capitalize">{image.provider} • {image.model}</span>
          <span>{new Date(image.created_at).toLocaleDateString()}</span>
        </div>
      </div>

    </div>
  );
};

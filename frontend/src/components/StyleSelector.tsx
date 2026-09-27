import React from 'react';
import { 
  Camera, Film, Box, Sparkles, Smile, Palette, 
  Wand, Zap, Droplets, Brush, Minimize2, 
  ShoppingBag, Building, Trees
} from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
}

export const STYLES_LIST = [
  { id: 'Photorealistic', name: 'Photorealistic', icon: Camera, desc: '8K razor-sharp reality & natural light', gradient: 'from-blue-600/30 to-cyan-500/20' },
  { id: 'Cinematic', name: 'Cinematic', icon: Film, desc: '35mm anamorphic widescreen lighting', gradient: 'from-amber-600/30 to-red-500/20' },
  { id: '3D Render', name: '3D Render', icon: Box, desc: 'Octane & Unreal Engine 5 CGI render', gradient: 'from-purple-600/30 to-indigo-500/20' },
  { id: 'Anime', name: 'Anime', icon: Sparkles, desc: 'Shinkai aesthetic with vibrant cel shading', gradient: 'from-pink-600/30 to-rose-400/20' },
  { id: 'Cartoon', name: 'Cartoon', icon: Smile, desc: 'Playful vector curves & expressive design', gradient: 'from-yellow-500/30 to-orange-500/20' },
  { id: 'Digital Art', name: 'Digital Art', icon: Palette, desc: 'ArtStation trending concept masterpiece', gradient: 'from-indigo-600/30 to-blue-500/20' },
  { id: 'Fantasy', name: 'Fantasy', icon: Wand, desc: 'Ethereal magic, glowing particles & mythic lore', gradient: 'from-purple-500/30 to-fuchsia-600/20' },
  { id: 'Cyberpunk', name: 'Cyberpunk', icon: Zap, desc: 'Neon cityscape, chrome & wet reflections', gradient: 'from-cyan-500/30 to-fuchsia-500/20' },
  { id: 'Watercolor', name: 'Watercolor', icon: Droplets, desc: 'Fluid pigment washes on textured paper', gradient: 'from-teal-500/30 to-sky-400/20' },
  { id: 'Oil Painting', name: 'Oil Painting', icon: Brush, desc: 'Classical impasto brushwork & chiaroscuro', gradient: 'from-amber-700/30 to-yellow-600/20' },
  { id: 'Minimalist', name: 'Minimalist', icon: Minimize2, desc: 'Refined negative space & geometric purity', gradient: 'from-slate-600/30 to-zinc-400/20' },
  { id: 'Product Photography', name: 'Product Photography', icon: ShoppingBag, desc: 'Softbox diffused commercial studio shoot', gradient: 'from-emerald-600/30 to-teal-400/20' },
  { id: 'Architecture', name: 'Architecture', icon: Building, desc: 'Parametric brutalist lines & ambient light', gradient: 'from-sky-700/30 to-slate-500/20' },
  { id: 'Nature Photography', name: 'Nature Photography', icon: Trees, desc: 'National Geographic telephoto wildlife', gradient: 'from-green-600/30 to-lime-500/20' },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelectStyle }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-electric" />
          Aesthetic Style ({STYLES_LIST.length})
        </label>
        <span className="text-xs text-soft-dim font-mono">
          Active: <span className="text-neon-green font-medium">{selectedStyle}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {STYLES_LIST.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle.toLowerCase() === style.id.toLowerCase();
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`relative flex flex-col items-start p-3 rounded-xl text-left transition-all duration-200 border ${
                isSelected
                  ? 'bg-surface-card border-neon-green shadow-glow-neon ring-1 ring-neon-green/50'
                  : 'bg-surface-dark/80 border-surface-border hover:border-slate-500 hover:bg-surface-card'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br ${style.gradient} border border-white/10`}>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-neon-green' : 'text-slate-300'}`} />
              </div>
              <span className="text-xs font-semibold text-white leading-tight mb-1 truncate w-full">
                {style.name}
              </span>
              <span className="text-[10px] text-soft-dim line-clamp-2 leading-tight">
                {style.desc}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green shadow-glow-neon" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

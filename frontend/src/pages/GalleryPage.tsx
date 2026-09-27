import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Search, Heart, Filter, 
  Trash2, RefreshCw, Sparkles, SlidersHorizontal, Download 
} from 'lucide-react';
import { getGallery, toggleFavorite, deleteImage } from '../services/api';
import { GeneratedImage } from '../types';
import { ImageCard } from '../components/ImageCard';
import { LightboxModal } from '../components/LightboxModal';
import { STYLES_LIST } from '../components/StyleSelector';

interface GalleryPageProps {
  onRegeneratePrompt?: (prompt: string, style: string) => void;
  onUseAsReference?: (image: GeneratedImage) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onRegeneratePrompt,
  onUseAsReference
}) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [modeFilter, setModeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [activeLightboxImage, setActiveLightboxImage] = useState<GeneratedImage | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await getGallery({
        search: searchQuery || undefined,
        style: selectedStyle !== 'All' ? selectedStyle : undefined,
        favorite_only: favoriteOnly,
        mode: modeFilter !== 'all' ? modeFilter : undefined,
        limit: 100
      });
      let resultList = res.images || [];
      if (sortOrder === 'asc') {
        resultList = [...resultList].reverse();
      }
      setImages(resultList);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedStyle, favoriteOnly, modeFilter, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchImages();
  };

  const handleToggleFav = async (id: string) => {
    try {
      const res = await toggleFavorite(id);
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, is_favorite: res.is_favorite } : img))
      );
      if (activeLightboxImage && activeLightboxImage.id === id) {
        setActiveLightboxImage({ ...activeLightboxImage, is_favorite: res.is_favorite });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (activeLightboxImage && activeLightboxImage.id === id) {
        setActiveLightboxImage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Studio Image Gallery
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/30">
              {images.length} Assets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-soft-gray mt-1">
            Persistent archive of all generated prompts, parameters, and high-resolution renders.
          </p>
        </div>

        <button
          onClick={fetchImages}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-xs text-soft-light transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-electric' : ''}`} />
          Refresh Gallery
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-surface-border space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-soft-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white placeholder-soft-dim focus:outline-none focus:border-electric"
            />
          </form>

          {/* Style Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-soft-dim hidden sm:inline">Style:</span>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            >
              <option value="All">All Styles</option>
              {STYLES_LIST.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            >
              <option value="all">All Modes</option>
              <option value="text2img">Text to Image</option>
              <option value="img2img">Image to Image</option>
              <option value="poster">Poster Studio</option>
            </select>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all shrink-0 ${
              favoriteOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-glow-neon'
                : 'bg-surface-dark text-soft-gray border-surface-border hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoriteOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
            Favorites Only
          </button>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-xs text-soft-gray transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>

        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-electric animate-spin mx-auto" />
          <p className="text-sm text-soft-gray">Loading studio gallery...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-surface-border p-8 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-card flex items-center justify-center mx-auto text-soft-dim">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No images found</h3>
            <p className="text-xs text-soft-dim mt-1">
              {searchQuery || selectedStyle !== 'All' || favoriteOnly
                ? 'Try adjusting your search filters or clearing the favorite filter.'
                : 'You have not generated any images yet. Start by generating your first image in the Studio!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onView={setActiveLightboxImage}
              onToggleFavorite={handleToggleFav}
              onDelete={handleDelete}
              onUseAsReference={onUseAsReference}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        image={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
        onToggleFavorite={handleToggleFav}
        onDelete={handleDelete}
        onRegenerate={(img) => {
          if (onRegeneratePrompt) {
            onRegeneratePrompt(img.prompt, img.style);
          }
        }}
      />

    </div>
  );
};

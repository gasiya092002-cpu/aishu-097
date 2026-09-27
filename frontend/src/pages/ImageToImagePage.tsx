import React, { useState } from 'react';
import { 
  Upload, Layers, Sparkles, Wand2, Zap, AlertCircle, 
  ArrowRight, Download, Eye, RefreshCw, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STYLES_LIST } from '../components/StyleSelector';
import { uploadReferenceImage, imageToImage, toggleFavorite, deleteImage } from '../services/api';
import { GeneratedImage } from '../types';
import { LightboxModal } from '../components/LightboxModal';

interface ImageToImagePageProps {
  initialReferenceImage?: GeneratedImage | null;
}

export const ImageToImagePage: React.FC<ImageToImagePageProps> = ({ initialReferenceImage }) => {
  const [referenceUrl, setReferenceUrl] = useState<string>(initialReferenceImage?.image_url || '');
  const [referenceInfo, setReferenceInfo] = useState<any>(null);
  const [transformPrompt, setTransformPrompt] = useState('');
  const [modeType, setModeType] = useState('style_transfer');
  const [selectedStyle, setSelectedStyle] = useState('Anime');
  const [strength, setStrength] = useState(0.75);

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultImage, setResultImage] = useState<GeneratedImage | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    try {
      const res = await uploadReferenceImage(file);
      setReferenceUrl(res.reference.url);
      setReferenceInfo(res.reference);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTransform = async () => {
    if (!referenceUrl) {
      setErrorMessage('Please upload or select a reference image first.');
      return;
    }
    if (!transformPrompt.trim()) {
      setErrorMessage('Please describe how you want to transform this image.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await imageToImage({
        reference_url: referenceUrl,
        transformation_prompt: transformPrompt,
        style: selectedStyle,
        mode_type: modeType,
        strength,
        aspect_ratio: referenceInfo?.aspect_ratio || '1:1',
        provider: 'pollinations'
      });

      setResultImage(res.image);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#39FF88', '#3B82F6']
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'Transformation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-surface-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Image-to-Image Transformation Studio
          </h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/30">
            Vision Conditioning
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-gray mt-1">
          Upload an existing photo or sketch and re-imagine it with style transfer, background replacement, or visual variations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload & Reference Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-electric/30 shadow-glass space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>01. Source Reference Image</span>
              {referenceUrl && (
                <span className="text-neon-green text-[10px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              )}
            </h3>

            {/* Dropzone */}
            <div className="relative border-2 border-dashed border-surface-border hover:border-electric rounded-2xl p-6 text-center transition-all bg-surface-dark/50 group">
              {referenceUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-square max-h-72 mx-auto rounded-xl overflow-hidden bg-navy-950">
                    <img
                      src={referenceUrl}
                      alt="Reference"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-lighter text-xs text-soft-light cursor-pointer transition-colors border border-surface-border">
                    <Upload className="w-3.5 h-3.5 text-electric" /> Replace Image
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-electric/10 border border-electric/30 flex items-center justify-center text-electric group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isUploading ? 'Uploading reference...' : 'Click or Drag image here'}
                    </p>
                    <p className="text-xs text-soft-dim mt-0.5">PNG, JPG, or WebP up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {referenceInfo && (
              <div className="p-3 rounded-xl bg-surface-dark border border-surface-border text-xs text-soft-dim flex items-center justify-between font-mono">
                <span>{referenceInfo.width}x{referenceInfo.height} px</span>
                <span className="text-electric-glow">Ratio: {referenceInfo.aspect_ratio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transformation Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-electric/30 shadow-glass space-y-6">
            
            {/* Transformation Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
                02. Transformation Objective
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'style_transfer', label: 'Style Transfer', desc: 'Anime, 3D, Oil Painting' },
                  { id: 'background_replacement', label: 'Background Replace', desc: 'Isolate & change scenery' },
                  { id: 'variation', label: 'Creative Variation', desc: 'Re-imagine details' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModeType(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modeType === m.id
                        ? 'bg-electric/20 border-electric text-white shadow-glow-blue'
                        : 'bg-surface-dark border-surface-border text-soft-gray hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{m.label}</span>
                    <span className="text-[10px] text-soft-dim">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transformation Description Prompt */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center justify-between">
                <span>03. Transformation Prompt</span>
                <span className="text-[10px] text-soft-dim">Describe desired changes</span>
              </label>
              <textarea
                rows={3}
                value={transformPrompt}
                onChange={(e) => setTransformPrompt(e.target.value)}
                placeholder="e.g. Convert this portrait into a futuristic cyberpunk cyborg with glowing neon wires and holographic eyes..."
                className="w-full p-4 rounded-xl bg-surface-dark border border-surface-border text-sm text-white placeholder-soft-dim focus:outline-none focus:border-electric resize-none"
              />

              {/* Sample transformation presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Turn into Makoto Shinkai anime aesthetic with glowing sky',
                  'Replace background with dramatic neon cyberpunk city skyline',
                  'Transform into luxury commercial studio product photography',
                  'Convert into classical textured oil painting with golden rim light'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTransformPrompt(sample)}
                    className="text-[10px] text-soft-light bg-surface-dark hover:bg-surface-card px-2.5 py-1 rounded-full border border-surface-border truncate max-w-xs transition-colors"
                  >
                    "{sample.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Target Aesthetic Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
                04. Target Aesthetic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLES_LIST.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left truncate transition-all ${
                      selectedStyle === s.id
                        ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-glow-neon'
                        : 'bg-surface-dark border-surface-border text-soft-gray hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditioning Strength Slider */}
            <div className="space-y-2 p-3.5 rounded-xl bg-surface-dark border border-surface-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-soft-light">Transformation Strength / Influence</span>
                <span className="font-mono text-neon-green">{Math.round(strength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="w-full accent-neon-green"
              />
              <div className="flex justify-between text-[10px] text-soft-dim">
                <span>Subtle refinement</span>
                <span>Balanced</span>
                <span>Complete metamorphosis</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Transform Button */}
            <button
              type="button"
              onClick={handleTransform}
              disabled={isProcessing || !referenceUrl || !transformPrompt.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-electric to-neon-green text-navy-950 font-extrabold text-sm shadow-glow-neon hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Wand2 className="w-4 h-4" />
              {isProcessing ? 'AI Agent Transforming Image...' : 'Transform Image Now'}
            </button>

          </div>
        </div>

      </div>

      {/* Side-by-Side Comparison Results */}
      {resultImage && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-neon-green/30 shadow-glass space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-green" />
                Transformation Comparison
              </h2>
              <p className="text-xs text-soft-gray mt-0.5">
                Side-by-side view of the original reference and AI-generated vision.
              </p>
            </div>
            <button
              onClick={() => setLightboxImage(resultImage)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-electric text-white text-xs font-semibold shadow-glow-blue hover:brightness-110"
            >
              <Eye className="w-3.5 h-3.5" /> Fullscreen View
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Original */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-soft-dim uppercase tracking-wider">Before: Original Reference</span>
              <div className="aspect-square rounded-2xl overflow-hidden bg-navy-950 border border-surface-border">
                <img
                  src={referenceUrl}
                  alt="Original Reference"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Transformed */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-neon-green uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> After: Transformed AI Masterpiece
              </span>
              <div className="aspect-square rounded-2xl overflow-hidden bg-navy-950 border border-neon-green/40 shadow-glow-neon">
                <img
                  src={resultImage.image_url}
                  alt={resultImage.prompt}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
        onToggleFavorite={async (id) => {
          const res = await toggleFavorite(id);
          if (resultImage && resultImage.id === id) {
            setResultImage({ ...resultImage, is_favorite: res.is_favorite });
          }
        }}
        onDelete={async (id) => {
          await deleteImage(id);
          setResultImage(null);
          setLightboxImage(null);
        }}
      />

    </div>
  );
};

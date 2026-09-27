import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Zap, Sliders, RotateCcw, 
  Copy, Check, Download, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StyleSelector } from '../components/StyleSelector';
import { AspectRatioSelector } from '../components/AspectRatioSelector';
import { AgentWorkflowVisualizer } from '../components/AgentWorkflowVisualizer';
import { PromptDiffModal } from '../components/PromptDiffModal';
import { ImageCard } from '../components/ImageCard';
import { LightboxModal } from '../components/LightboxModal';
import { generateImage, enhancePrompt, toggleFavorite, deleteImage } from '../services/api';
import { GeneratedImage, EnhanceResult } from '../types';

interface GeneratorPageProps {
  initialPrompt?: string;
  initialStyle?: string;
  onNavigateTab: (tab: string) => void;
  onSelectReferenceImage?: (img: GeneratedImage) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({
  initialPrompt = '',
  initialStyle = 'Photorealistic',
  onNavigateTab,
  onSelectReferenceImage
}) => {
  // Input states
  const [prompt, setPrompt] = useState(initialPrompt);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [style, setStyle] = useState(initialStyle);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [provider, setProvider] = useState('pollinations');
  const [quality, setQuality] = useState('standard');
  const [count, setCount] = useState(1);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [negativePrompt, setNegativePrompt] = useState('');

  // Agent & Workflow Execution States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modals & Results
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<GeneratedImage | null>(null);
  const [latestResults, setLatestResults] = useState<GeneratedImage[]>([]);

  const samplePrompts = [
    'A cyberpunk samurai cat standing on a neon-lit rain-slicked Tokyo alley, 8k resolution',
    'A majestic crystal stag glowing in an enchanted bioluminescent deep forest at twilight',
    'An hyper-futuristic electric supercar parked in front of a modern glass architectural villa in the Alps',
    'A serene ancient Japanese tea pavilion surrounded by pink cherry blossoms beside a reflective pond'
  ];

  const handleRandomPrompt = () => {
    const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(random);
    setEnhancedPrompt('');
  };

  const handleEnhanceClick = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setErrorMessage('');
    try {
      const res = await enhancePrompt(prompt, style);
      setEnhanceResult(res);
      setDiffModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Prompt enhancement failed.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplyEnhancedPrompt = (approvedPrompt: string) => {
    setEnhancedPrompt(approvedPrompt);
  };

  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage('');
    setCurrentStepIndex(0);
    setStatusMessage('Agent analyzing semantic prompt tokens...');

    // Simulate reactive workflow progression
    const stepTimer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setStatusMessage(`Synthesizing style physics for [${style}] & camera optics...`);
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setStatusMessage('Validating neural model constraints and dimensions...');
    }, 1200);

    const stepTimer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setStatusMessage(`Dispatching tensor generation to AI engine (${provider})...`);
    }, 1800);

    try {
      const res = await generateImage({
        prompt: activePrompt,
        enhanced_prompt: enhancedPrompt || undefined,
        style,
        aspect_ratio: aspectRatio,
        provider,
        seed: seed || undefined,
        quality,
        count
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      setCurrentStepIndex(4);
      setStatusMessage('Images rendered and saved to persistent studio storage.');
      setLatestResults(res.images);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#3B82F6', '#39FF88', '#F8FAFC']
      });

    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setErrorMessage(err.message || 'Generation failed. Check server status or API key.');
      setCurrentStepIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFav = async (id: string) => {
    try {
      const res = await toggleFavorite(id);
      setLatestResults((prev) =>
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
      setLatestResults((prev) => prev.filter((img) => img.id !== id));
      if (activeLightboxImage && activeLightboxImage.id === id) {
        setActiveLightboxImage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Image Studio
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-electric/20 text-electric-glow border border-electric/30">
              Interactive Agent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-soft-gray mt-1">
            Transform text descriptions into high-resolution imagery using real-time diffusion models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-xs text-soft-light transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-green" />
            Random Prompt
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs transition-colors ${
              showAdvanced
                ? 'bg-electric/20 text-electric-glow border-electric/40'
                : 'bg-surface-dark text-soft-gray border-surface-border hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {showAdvanced ? 'Hide Settings' : 'Advanced Settings'}
          </button>
        </div>
      </div>

      {/* Main Studio Controls Box */}
      <div className="glass-panel p-6 rounded-2xl border border-electric/30 shadow-glass space-y-6">
        
        {/* Prompt Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center gap-1.5">
              <span>Text Prompt</span>
              {enhancedPrompt && (
                <span className="text-[10px] text-neon-green font-mono flex items-center gap-1">
                  • AI Enhanced Active
                </span>
              )}
            </label>
            <div className="flex items-center gap-3 text-xs text-soft-dim">
              <span>{prompt.length} characters</span>
              {prompt && (
                <button
                  type="button"
                  onClick={() => {
                    setPrompt('');
                    setEnhancedPrompt('');
                  }}
                  className="text-soft-dim hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (enhancedPrompt) setEnhancedPrompt('');
              }}
              placeholder="Describe your scene in detail... (e.g. A hyper-realistic portrait of an astronaut in a reflective visor, standing in a cosmic nebula, cinematic lighting)"
              className="w-full p-4 rounded-xl bg-surface-dark border border-surface-border text-sm text-white placeholder-soft-dim focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric resize-none leading-relaxed"
            />
          </div>

          {/* Prompt Enhancement Display Bar */}
          {enhancedPrompt && (
            <div className="p-3 rounded-xl bg-surface-card border border-neon-green/30 flex items-start justify-between gap-3 text-xs animate-in fade-in">
              <div className="space-y-1">
                <span className="font-semibold text-neon-green flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Enhanced Prompt Applied:
                </span>
                <p className="text-soft-light leading-relaxed">{enhancedPrompt}</p>
              </div>
              <button
                type="button"
                onClick={() => setEnhancedPrompt('')}
                className="text-[10px] text-soft-dim hover:text-white shrink-0 underline"
              >
                Revert to original
              </button>
            </div>
          )}
        </div>

        {/* Style Selector Component */}
        <StyleSelector
          selectedStyle={style}
          onSelectStyle={setStyle}
        />

        {/* Aspect Ratio Selector Component */}
        <AspectRatioSelector
          selectedRatio={aspectRatio}
          onSelectRatio={setAspectRatio}
        />

        {/* Advanced Settings Accordion Panel */}
        {showAdvanced && (
          <div className="p-5 rounded-xl bg-surface-dark border border-surface-border space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-electric" />
              Advanced Generation Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-soft-dim uppercase tracking-wider">AI Model Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
                >
                  <option value="pollinations">Pollinations AI (Flux / SDXL)</option>
                  <option value="openai">OpenAI (DALL-E 3)</option>
                </select>
                <span className="text-[10px] text-neon-green block">
                  {provider === 'pollinations' ? 'Free Instant Flux Engine' : 'Requires OPENAI_API_KEY'}
                </span>
              </div>

              {/* Number of Images */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-soft-dim uppercase tracking-wider">Batch Count</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
                >
                  <option value={1}>1 Image</option>
                  <option value={2}>2 Variations</option>
                  <option value={4}>4 Variations</option>
                </select>
              </div>

              {/* Quality Preset */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-soft-dim uppercase tracking-wider">Image Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
                >
                  <option value="standard">Standard Quality (1024px)</option>
                  <option value="hd">Ultra HD Quality</option>
                </select>
              </div>

              {/* Custom Seed */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-soft-dim uppercase tracking-wider">Seed (Optional)</label>
                <input
                  type="number"
                  value={seed || ''}
                  onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Random"
                  className="w-full p-2.5 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
                />
              </div>

            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] text-soft-dim uppercase tracking-wider">Negative Prompt (Exclude features)</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g. blurry, deformed, low quality, oversaturated, watermark"
                className="w-full p-2.5 rounded-lg bg-navy-950 border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
              />
            </div>
          </div>
        )}

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-border">
          
          <button
            type="button"
            onClick={handleEnhanceClick}
            disabled={!prompt.trim() || isEnhancing || isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-card hover:bg-surface-lighter border border-surface-border text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Wand2 className={`w-4 h-4 text-neon-green ${isEnhancing ? 'animate-spin' : ''}`} />
            {isEnhancing ? 'AI Agent Enhancing...' : 'Enhance Prompt with AI'}
          </button>

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-electric via-electric-deep to-neon-green text-navy-950 font-extrabold text-sm shadow-glow-neon hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Zap className="w-4 h-4 fill-navy-950" />
            {isGenerating ? 'AI Agent Generating...' : `Generate ${count > 1 ? `${count} Images` : 'Image'}`}
          </button>

        </div>

      </div>

      {/* Real-time Agent Workflow Progress */}
      <AgentWorkflowVisualizer
        currentStepIndex={currentStepIndex}
        isGenerating={isGenerating}
        statusMessage={statusMessage}
      />

      {/* Generated Images Studio Results */}
      {latestResults.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-green" />
              Generated Studio Output ({latestResults.length})
            </h2>
            <button
              onClick={() => onNavigateTab('gallery')}
              className="text-xs text-electric-glow hover:underline font-medium"
            >
              View Full Gallery →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestResults.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                onView={setActiveLightboxImage}
                onToggleFavorite={handleToggleFav}
                onDelete={handleDelete}
                onUseAsReference={onSelectReferenceImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Prompt Diff Modal */}
      <PromptDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        enhanceResult={enhanceResult}
        onApply={handleApplyEnhancedPrompt}
      />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        image={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
        onToggleFavorite={handleToggleFav}
        onDelete={handleDelete}
        onRegenerate={(img) => {
          setPrompt(img.prompt);
          setStyle(img.style);
          setAspectRatio(img.aspect_ratio);
          handleGenerate(img.prompt);
        }}
        onVariation={(img) => {
          setPrompt(img.prompt);
          setStyle(img.style);
          setSeed(undefined);
          handleGenerate(img.prompt);
        }}
      />

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  LayoutTemplate, Sparkles, Wand2, Zap, AlertCircle, 
  ArrowRight, Download, Type, CheckCircle2, ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPosterPresets, buildPosterPrompt, generateImage } from '../services/api';
import { PosterPreset, GeneratedImage } from '../types';
import { TextOverlayEditor } from '../components/TextOverlayEditor';

export const PosterStudioPage: React.FC = () => {
  const [presets, setPresets] = useState<PosterPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PosterPreset | null>(null);

  // Assistant Inputs
  const [topic, setTopic] = useState('Next-Generation Artificial Intelligence Summit');
  const [headline, setHeadline] = useState('AI INNOVATION SUMMIT 2026');
  const [subtext, setSubtext] = useState('Shaping Autonomous Reasoning & Creative Workflows');
  const [badgeText, setBadgeText] = useState('OCTOBER 24 • TECH ARENA');
  const [mood, setMood] = useState('Futuristic, Cybernetic & Minimalist');

  // Generation & Editor States
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedPosterBg, setGeneratedPosterBg] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    getPosterPresets()
      .then((res) => {
        setPresets(res.presets);
        if (res.presets.length > 0) {
          const first = res.presets[0];
          setSelectedPreset(first);
          setHeadline(first.template_headline);
          setSubtext(first.template_subtext);
          setBadgeText(first.badge_text);
        }
      })
      .catch((err) => console.error('Presets loading error:', err));
  }, []);

  const handleSelectPreset = (p: PosterPreset) => {
    setSelectedPreset(p);
    setHeadline(p.template_headline);
    setSubtext(p.template_subtext);
    setBadgeText(p.badge_text);
  };

  const handleGeneratePoster = async () => {
    if (!topic.trim()) {
      setErrorMessage('Please enter a poster topic or event concept.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    try {
      // Step 1: Agent builds prompt tailored for graphic design text overlays
      const promptData = await buildPosterPrompt({
        category: selectedPreset?.platform || 'General',
        headline,
        subtext,
        topic,
        mood
      });

      // Step 2: Generate background image with the appropriate aspect ratio and style
      const genRes = await generateImage({
        prompt: promptData.poster_background_prompt,
        style: selectedPreset?.recommended_style || 'Digital Art',
        aspect_ratio: selectedPreset?.aspect_ratio || '4:5',
        provider: 'pollinations',
        mode: 'poster'
      });

      if (genRes.images && genRes.images.length > 0) {
        setGeneratedPosterBg(genRes.images[0]);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#39FF88', '#F8FAFC']
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Poster background generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-surface-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Poster & Typography Studio
          </h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-electric/20 text-electric-glow border border-electric/30">
            Multi-Platform Graphic Design
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-gray mt-1">
          Create marketing, event, and social media posters with AI background synthesis and vector text overlay layout.
        </p>
      </div>

      {/* Preset Category Picker */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="w-3.5 h-3.5 text-electric" />
          Choose Poster Preset & Dimension Format
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((p) => {
            const isSelected = selectedPreset?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-electric/20 border-electric text-white shadow-glow-blue'
                    : 'bg-surface-dark border-surface-border text-soft-gray hover:border-slate-500 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded">
                    {p.aspect_ratio}
                  </span>
                  <span className="text-[10px] text-soft-dim">{p.dimensions}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                <p className="text-[10px] text-soft-dim mt-0.5 line-clamp-1">{p.platform}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Prompt Assistant Form */}
      <div className="glass-panel p-6 rounded-2xl border border-electric/30 shadow-glass space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-neon-green" />
            AI Poster Concept Assistant
          </h3>
          <span className="text-xs text-soft-dim font-mono">
            Optimized for layout safe-zones
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Topic / Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
              Poster Subject & Theme
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Annual Cloud Computing Conference"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            />
          </div>

          {/* Visual Mood / Aesthetics */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
              Visual Atmosphere & Style
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. Moody neon cyberpunk with deep contrast"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            />
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
              Primary Headline Text
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. INNOVA 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            />
          </div>

          {/* Subtext */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
              Subtitle / Supporting Text
            </label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              placeholder="e.g. The premier summit for machine learning leaders"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
            />
          </div>
        </div>

        {/* Badge / Pill */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-soft-light uppercase tracking-wider">
            Call-to-Action / Date Badge
          </label>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="e.g. LIMITED SEATS AVAILABLE • REGISTER TODAY"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <span className="text-xs text-soft-dim">
            Selected Layout: <strong className="text-white">{selectedPreset?.title}</strong> ({selectedPreset?.dimensions})
          </span>
          <button
            type="button"
            onClick={handleGeneratePoster}
            disabled={isGenerating || !topic.trim()}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-electric to-neon-green text-navy-950 font-extrabold text-sm shadow-glow-neon hover:opacity-95 disabled:opacity-50 transition-all"
          >
            <Zap className="w-4 h-4 fill-navy-950" />
            {isGenerating ? 'AI Synthesizing Poster Canvas...' : 'Generate Poster Artwork'}
          </button>
        </div>

      </div>

      {/* Interactive Text Overlay Canvas Editor Section */}
      {generatedPosterBg && (
        <div className="space-y-4 pt-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-neon-green" />
              <h2 className="text-xl font-bold text-white">
                Interactive Poster Typography & Export Canvas
              </h2>
            </div>
            <span className="text-xs text-soft-dim font-mono">
              Post-generation typography refinement
            </span>
          </div>

          <TextOverlayEditor
            imageUrl={generatedPosterBg.image_url}
            defaultHeadline={headline}
            defaultSubtext={subtext}
            defaultBadge={badgeText}
          />
        </div>
      )}

    </div>
  );
};

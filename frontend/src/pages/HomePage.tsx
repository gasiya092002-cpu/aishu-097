import React, { useState } from 'react';
import { 
  Sparkles, Wand2, ArrowRight, Zap, Shield, 
  Cpu, Layers, Sliders, CheckCircle2, ChevronRight, Eye 
} from 'lucide-react';
import { STYLES_LIST } from '../components/StyleSelector';

interface HomePageProps {
  onQuickGenerate: (prompt: string, style: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onQuickGenerate, onNavigateTab }) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');

  const samplePrompts = [
    'A cyberpunk samurai standing on a skyscraper rooftop in neo-Tokyo in the rain',
    'A mystical ancient library carved inside an emerald crystal cavern with floating books',
    'An astronaut discovering a bioluminescent garden on a distant alien planet',
    'Sleek modern transparent concept sports car driving through futuristic architectural tunnels'
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onQuickGenerate(quickPrompt, selectedStyle);
  };

  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Glow ambient background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-electric/20 via-neon-green/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-dark/90 border border-electric/40 text-xs text-soft-light shadow-glow-blue animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-neon-green" />
            <span>Next-Gen Agentic Text-to-Image Generation</span>
            <span className="text-soft-dim">•</span>
            <span className="text-electric-glow font-semibold">Zero-Setup Instant Diffusion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Turn Your Ideas <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-electric via-neon-green to-white bg-clip-text text-transparent">
              Into Images.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-soft-gray max-w-2xl mx-auto font-normal leading-relaxed">
            An intelligent AI agent that transforms your imagination into stunning visuals. With real-time prompt enhancement, autonomous parameter validation, and multi-model diffusion.
          </p>

          {/* Quick Prompt Input Card */}
          <div className="max-w-3xl mx-auto pt-4">
            <form 
              onSubmit={handleHeroSubmit}
              className="glass-panel p-2.5 sm:p-3 rounded-2xl border border-electric/40 shadow-2xl space-y-3"
            >
              <div className="relative">
                <textarea
                  rows={3}
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Describe anything you can imagine... (e.g., A futuristic humanoid robot in neon city street at night)"
                  className="w-full p-4 rounded-xl bg-surface-dark/80 text-white placeholder-soft-dim focus:outline-none focus:ring-1 focus:ring-electric border border-surface-border text-sm resize-none leading-relaxed"
                />
              </div>

              {/* Controls bar inside card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 px-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-soft-dim hidden sm:inline">Style:</span>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
                  >
                    {STYLES_LIST.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (!quickPrompt.trim()) {
                        setQuickPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)]);
                      } else {
                        onQuickGenerate(quickPrompt, selectedStyle);
                      }
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-lighter border border-surface-border text-soft-light text-xs font-medium transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-neon-green" />
                    {quickPrompt.trim() ? 'Enhance & Generate' : 'Inspire Me'}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!quickPrompt.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric to-electric-deep text-white font-bold text-xs shadow-glow-blue hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    Generate Image
                  </button>
                </div>
              </div>
            </form>

            {/* Clickable prompt chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-soft-dim">Try an example:</span>
              {samplePrompts.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuickPrompt(p)}
                  className="text-[11px] text-soft-light bg-surface-dark/70 hover:bg-surface-card px-2.5 py-1 rounded-full border border-surface-border truncate max-w-xs transition-colors text-left"
                >
                  "{p.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Popular Image Styles Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-xs font-mono text-neon-green tracking-wider uppercase font-semibold">
              Curated Aesthetics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Popular Image Styles
            </h2>
            <p className="text-xs sm:text-sm text-soft-gray mt-1">
              Engineered with specialized visual modifiers, lighting physics, and composition parameters.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('generator')}
            className="flex items-center gap-1.5 text-xs text-electric-glow hover:underline self-start sm:self-auto font-medium"
          >
            Explore all 14 styles in Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLES_LIST.slice(0, 8).map((style) => {
            const Icon = style.icon;
            return (
              <div
                key={style.id}
                onClick={() => {
                  setSelectedStyle(style.id);
                  onNavigateTab('generator');
                }}
                className="glass-card glass-card-hover p-5 rounded-2xl border border-surface-border cursor-pointer group relative overflow-hidden"
              >
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${style.gradient} border border-white/10 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-neon-green" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-electric-glow transition-colors">
                  {style.name}
                </h3>
                <p className="text-xs text-soft-dim mt-1.5 leading-relaxed">
                  {style.desc}
                </p>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-border/50 text-[11px] text-soft-gray">
                  <span>Create with style</span>
                  <ChevronRight className="w-3.5 h-3.5 text-soft-dim group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-electric/30 shadow-glass relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-mono text-neon-green uppercase tracking-wider font-semibold">
              The Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How the Intelligent AI Agent Operates
            </h2>
            <p className="text-xs sm:text-sm text-soft-gray">
              A transparent, autonomous workflow that refines prompts, coordinates models, and renders high-fidelity visual assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="p-5 rounded-2xl bg-surface-dark/90 border border-surface-border space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-electric/20 border border-electric/40 text-electric-glow flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Prompt Intent Analysis</h3>
              <p className="text-xs text-soft-dim leading-relaxed">
                The agent parses subject nouns, environment, lighting tone, and perspective, detecting missing composition cues.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-dark/90 border border-surface-border space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-neon-green/20 border border-neon-green/40 text-neon-green flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Autonomous Enhancement</h3>
              <p className="text-xs text-soft-dim leading-relaxed">
                Visual optics, camera angles (85mm, tilt-shift), and lighting modifiers are injected while preserving your core meaning.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-dark/90 border border-surface-border space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Neural Diffusion Dispatch</h3>
              <p className="text-xs text-soft-dim leading-relaxed">
                Parameters are validated and routed to Flux, SDXL, or DALL-E 3 for ultra-detailed tensor diffusion rendering.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-dark/90 border border-surface-border space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-sm font-bold text-white">Studio Gallery & Post-Ops</h3>
              <p className="text-xs text-soft-dim leading-relaxed">
                High-resolution PNGs are cached to disk, indexed in SQLite, ready for download, poster typography, or variations.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigateTab('generator')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-electric to-neon-green text-navy-950 font-extrabold text-sm shadow-glow-neon hover:opacity-95 transition-all"
            >
              Launch Image Studio Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

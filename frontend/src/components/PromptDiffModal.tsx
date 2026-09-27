import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Sun, Eye, Layers } from 'lucide-react';
import { EnhanceResult } from '../types';

interface PromptDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  enhanceResult: EnhanceResult | null;
  onApply: (finalPrompt: string) => void;
}

export const PromptDiffModal: React.FC<PromptDiffModalProps> = ({
  isOpen,
  onClose,
  enhanceResult,
  onApply
}) => {
  if (!isOpen || !enhanceResult) return null;

  const [customPrompt, setCustomPrompt] = useState(enhanceResult.enhanced_prompt);

  const handleApply = () => {
    onApply(customPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-electric/40 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Prompt Enhancement & Analysis
              </h3>
              <p className="text-xs text-soft-gray">
                Agent-enhanced visual details powered by <span className="text-electric-glow font-mono">{enhanceResult.llm_provider}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-soft-gray hover:text-white rounded-lg hover:bg-surface-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Analysis Breakdown Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-surface-dark/90 border border-surface-border">
            <div className="flex items-center gap-1.5 text-xs text-soft-dim mb-1 font-medium">
              <Eye className="w-3.5 h-3.5 text-electric" /> Detected Subject
            </div>
            <p className="text-xs font-semibold text-white capitalize truncate">{enhanceResult.subject || 'Creative Subject'}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-dark/90 border border-surface-border">
            <div className="flex items-center gap-1.5 text-xs text-soft-dim mb-1 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Lighting & Atmosphere
            </div>
            <p className="text-xs font-semibold text-white line-clamp-1">{enhanceResult.lighting || 'Cinematic radiance'}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-dark/90 border border-surface-border">
            <div className="flex items-center gap-1.5 text-xs text-soft-dim mb-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-neon-green" /> Composition Perspective
            </div>
            <p className="text-xs font-semibold text-white line-clamp-1">{enhanceResult.composition || 'Heroic depth'}</p>
          </div>
        </div>

        {/* Comparison: Original vs Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-soft-dim uppercase tracking-wider">
              Original Prompt
            </label>
            <div className="p-4 rounded-xl bg-navy-950/60 border border-surface-border text-sm text-soft-gray min-h-[140px] leading-relaxed select-all">
              "{enhanceResult.original_prompt}"
            </div>
          </div>

          {/* Enhanced / Editable */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neon-green uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Enhanced Studio Prompt
              </label>
              <span className="text-[10px] text-soft-dim">Editable before approval</span>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={5}
              className="w-full p-4 rounded-xl bg-surface-card border border-electric/40 text-sm text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Style Modifiers Badges */}
        {enhanceResult.modifiers && enhanceResult.modifiers.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-soft-dim uppercase tracking-wider">Injected Visual Modifiers:</span>
            <div className="flex flex-wrap gap-1.5">
              {enhanceResult.modifiers.map((mod, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[11px] bg-electric/10 text-electric-glow border border-electric/20 font-mono">
                  +{mod}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-surface-border text-soft-gray hover:text-white text-sm font-medium hover:bg-surface-dark transition-colors"
          >
            Keep Original
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric to-neon-green text-navy-950 font-bold text-sm shadow-glow-neon hover:opacity-95 transition-all"
          >
            <Check className="w-4 h-4" />
            Approve & Apply Enhanced Prompt
          </button>
        </div>

      </div>
    </div>
  );
};

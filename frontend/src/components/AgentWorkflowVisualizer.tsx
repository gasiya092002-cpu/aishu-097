import React from 'react';
import { Brain, Cpu, Wand2, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AgentWorkflowVisualizerProps {
  currentStepIndex: number;
  isGenerating: boolean;
  statusMessage?: string;
}

export const WORKFLOW_STEPS = [
  {
    title: 'Prompt Analysis',
    desc: 'Extracting subject, lighting, mood, & composition context',
    icon: Brain
  },
  {
    title: 'Visual Enhancement',
    desc: 'Synthesizing cinematic style modifiers & optics',
    icon: Wand2
  },
  {
    title: 'Model Validation',
    desc: 'Checking dimensions, seed validity, & safety filters',
    icon: ShieldCheck
  },
  {
    title: 'Neural Diffusion Dispatch',
    desc: 'Generating high-resolution tensors via AI diffusion engine',
    icon: Cpu
  },
  {
    title: 'Studio Persistence',
    desc: 'Post-processing, optimizing PNG, & caching metadata',
    icon: CheckCircle2
  }
];

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  currentStepIndex,
  isGenerating,
  statusMessage
}) => {
  if (!isGenerating && currentStepIndex === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-electric/30 shadow-glass my-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-electric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-electric/20 border border-electric/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-neon-green animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous AI Agent Execution Pipeline
            </h3>
            <p className="text-xs text-soft-gray font-mono">
              {statusMessage || 'Processing multi-modal generation parameters...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric/10 border border-electric/30 text-xs font-mono text-electric-glow">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-electric" />
          Step {Math.min(currentStepIndex + 1, WORKFLOW_STEPS.length)} of {WORKFLOW_STEPS.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = idx === currentStepIndex && isGenerating;
          const isDone = idx < currentStepIndex || (!isGenerating && currentStepIndex >= WORKFLOW_STEPS.length - 1);
          
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-electric/20 border-electric-glow shadow-glow-blue'
                  : isDone
                  ? 'bg-surface-card/90 border-neon-green/40'
                  : 'bg-surface-dark/40 border-surface-border opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isCurrent ? 'bg-electric text-white' : isDone ? 'bg-neon-green/20 text-neon-green' : 'bg-surface-border text-soft-dim'
                }`}>
                  {isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isCurrent ? 'bg-electric/30 text-white font-bold' : isDone ? 'bg-neon-green/10 text-neon-green' : 'text-soft-dim'
                }`}>
                  {isDone ? 'DONE' : isCurrent ? 'RUNNING' : `0${idx + 1}`}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">{step.title}</h4>
              <p className="text-[10px] text-soft-dim mt-1 leading-snug line-clamp-2">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

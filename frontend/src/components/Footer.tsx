import React from 'react';
import { Sparkles, Terminal, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-navy-950 py-10 mt-20 text-soft-gray text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-electric flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-wide">AI IMAGE STUDIO</span>
            </div>
            <p className="text-xs text-soft-dim max-w-sm leading-relaxed">
              Intelligent generative AI agent combining real-time prompt enhancement, autonomous parameter validation, neural image synthesis, and persistent studio asset management.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B1020] border border-white/20" title="Deep Navy (#0B1020)"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" title="Electric Blue (#3B82F6)"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF88]" title="Neon Green (#39FF88)"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#151C2C]" title="Dark Surface (#151C2C)"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" title="Soft Gray (#94A3B8)"></span>
              <span className="text-[11px] text-soft-dim ml-2 font-mono">Palette Fidelity 100%</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Model Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Cpu className="w-3.5 h-3.5 text-neon-green" /> Flux / SDXL Diffusion
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Cpu className="w-3.5 h-3.5 text-electric" /> OpenAI DALL-E 3
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Google Imagen 3
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Stability AI SD3
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Architecture & Privacy</h4>
            <ul className="space-y-2 text-xs text-soft-dim">
              <li className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-soft-light" /> Server-side API key isolation
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-soft-light" /> Local SQLite & Disk persistence
              </li>
              <li>FastAPI Async REST Endpoints</li>
              <li>React 19 & Tailwind Engine</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-surface-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-soft-dim">
          <p>© 2026 AI Image Studio. All rights reserved. Professional Generative Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-soft-light transition-colors">Privacy Safe</span>
            <span>•</span>
            <span className="hover:text-soft-light transition-colors">Zero Browser Key Leak</span>
            <span>•</span>
            <span className="text-neon-green font-mono">v1.0.0 Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

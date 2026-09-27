import React, { useState } from 'react';
import { Sparkles, Layers, Sliders, Image as ImageIcon, LayoutTemplate, Palette, Menu, X, Wand2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'generator', label: 'Image Studio', icon: Wand2 },
    { id: 'img2img', label: 'Image to Image', icon: Layers },
    { id: 'poster', label: 'AI Poster Studio', icon: LayoutTemplate },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Settings & Models', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-electric via-electric-deep to-neon-green p-[2px] shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neon-green transition-transform duration-300 group-hover:rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-soft-gray bg-clip-text text-transparent">
                  AI IMAGE STUDIO
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-neon-green/10 text-neon-green border border-neon-green/30">
                  AGENT 2.0
                </span>
              </div>
              <p className="text-[11px] text-soft-gray hidden sm:block tracking-wide">
                Intelligent Image Generation Agent
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-electric/15 text-electric-glow border border-electric/30 shadow-glow-blue'
                      : 'text-soft-gray hover:text-white hover:bg-surface-dark'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-electric-glow' : 'text-soft-dim'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Active Provider Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark/90 border border-surface-border text-xs text-soft-light">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              <span className="font-mono text-[11px]">Flux / Diffusion Active</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-soft-gray hover:text-white hover:bg-surface-dark focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-navy-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  isActive
                    ? 'bg-electric/20 text-electric-glow border border-electric/40'
                    : 'text-soft-gray hover:text-white hover:bg-surface-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sliders, ShieldCheck, Cpu, Key, Database, 
  Trash2, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, HardDrive 
} from 'lucide-react';
import { getSystemConfig, getHealth, testApiKey, clearGalleryData } from '../services/api';
import { SystemConfig } from '../types';

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Key tester states
  const [testProvider, setTestProvider] = useState('openai');
  const [testKeyInput, setTestKeyInput] = useState('');
  const [testResult, setTestResult] = useState<{ valid?: boolean; message?: string } | null>(null);
  const [testingKey, setTestingKey] = useState(false);

  const [clearStatus, setClearStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cfg, hlt] = await Promise.all([getSystemConfig(), getHealth()]);
      setConfig(cfg);
      setHealth(hlt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestKey = async () => {
    if (!testKeyInput.trim()) return;
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await testApiKey(testProvider, testKeyInput);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ valid: false, message: err.message || 'Key verification failed' });
    } finally {
      setTestingKey(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all database records from the studio gallery?')) {
      try {
        const res = await clearGalleryData();
        setClearStatus(res.message);
        loadData();
        setTimeout(() => setClearStatus(''), 4000);
      } catch (err: any) {
        setClearStatus('Failed to reset records');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-surface-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            System Settings & AI Providers
          </h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-electric/20 text-electric-glow border border-electric/30">
            Control Center
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-gray mt-1">
          Inspect neural diffusion backends, test server-side credentials, and manage persistent studio storage.
        </p>
      </div>

      {/* Backend Health & Status Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-electric/30 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                FastAPI Server Core
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/30">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-soft-dim font-mono">
                Port 8000 • Version {health?.version || '1.0.0'} • REST API Synchronized
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-xs text-soft-light transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-electric' : ''}`} />
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-xs text-soft-dim block mb-1">Total Generated Assets</span>
            <span className="text-xl font-bold font-mono text-white">
              {health?.storage?.total_images ?? 0}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-xs text-soft-dim block mb-1">Favorited Assets</span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {health?.storage?.total_favorites ?? 0}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-xs text-soft-dim block mb-1">Database Engine</span>
            <span className="text-xs font-bold font-mono text-neon-green">
              SQLite (backend/data/images.db)
            </span>
          </div>
        </div>
      </div>

      {/* AI Providers Overview Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-electric" />
          Configured Neural Diffusion Engines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pollinations AI (Active Default) */}
          <div className="glass-card p-5 rounded-2xl border border-neon-green/40 shadow-glow-neon space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Pollinations AI (Flux & SDXL)
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neon-green/20 text-neon-green border border-neon-green/40">
                ACTIVE DEFAULT
              </span>
            </div>
            <p className="text-xs text-soft-gray leading-relaxed">
              Provides real-time Flux and SDXL diffusion. Works immediately without requiring any API keys or credit card setup.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-soft-dim font-mono border-t border-surface-border/50">
              <span>Key Required: No</span>
              <span className="text-neon-green">Ready to Generate</span>
            </div>
          </div>

          {/* OpenAI */}
          <div className="glass-card p-5 rounded-2xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                OpenAI (DALL-E 3 & GPT-4o)
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                config?.providers?.openai?.is_configured
                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                  : 'bg-surface-dark text-soft-dim border-surface-border'
              }`}>
                {config?.providers?.openai?.is_configured ? 'KEY DETECTED' : 'UNCONFIGURED'}
              </span>
            </div>
            <p className="text-xs text-soft-gray leading-relaxed">
              High fidelity image generation and LLM prompt enhancement via OpenAI API keys configured in server environment.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-soft-dim font-mono border-t border-surface-border/50">
              <span>Env: OPENAI_API_KEY</span>
              <span>DALL-E 3 / GPT-4o</span>
            </div>
          </div>

          {/* Google Gemini */}
          <div className="glass-card p-5 rounded-2xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Google Gemini (Flash & Imagen)
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                config?.providers?.gemini?.is_configured
                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                  : 'bg-surface-dark text-soft-dim border-surface-border'
              }`}>
                {config?.providers?.gemini?.is_configured ? 'KEY DETECTED' : 'UNCONFIGURED'}
              </span>
            </div>
            <p className="text-xs text-soft-gray leading-relaxed">
              Powers Gemini LLM prompt enhancement with specialized lighting, camera, and composition engineering.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-soft-dim font-mono border-t border-surface-border/50">
              <span>Env: GEMINI_API_KEY</span>
              <span>Gemini 1.5/2.0</span>
            </div>
          </div>

          {/* Stability AI */}
          <div className="glass-card p-5 rounded-2xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Stability AI (SD3 / Core)
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                config?.providers?.stability?.is_configured
                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                  : 'bg-surface-dark text-soft-dim border-surface-border'
              }`}>
                {config?.providers?.stability?.is_configured ? 'KEY DETECTED' : 'UNCONFIGURED'}
              </span>
            </div>
            <p className="text-xs text-soft-gray leading-relaxed">
              Direct access to Stability's Stable Diffusion 3 Medium and Core generative engines.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-soft-dim font-mono border-t border-surface-border/50">
              <span>Env: STABILITY_API_KEY</span>
              <span>SD3 Medium</span>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Key Diagnostic Tool */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-electric" />
          <h3 className="text-sm font-bold text-white">API Key Connectivity Diagnostic</h3>
        </div>
        <p className="text-xs text-soft-gray leading-relaxed">
          Test your API credentials securely against upstream endpoints without exposing them to browser storage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <select
            value={testProvider}
            onChange={(e) => setTestProvider(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white focus:outline-none focus:border-electric"
          >
            <option value="openai">OpenAI API Key</option>
            <option value="gemini">Google Gemini API Key</option>
          </select>

          <input
            type="password"
            value={testKeyInput}
            onChange={(e) => setTestKeyInput(e.target.value)}
            placeholder="Paste API Key here (e.g. sk-... or AIza...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-xs text-white placeholder-soft-dim focus:outline-none focus:border-electric font-mono"
          />

          <button
            onClick={handleTestKey}
            disabled={testingKey || !testKeyInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-electric text-white text-xs font-semibold shadow-glow-blue hover:brightness-110 disabled:opacity-50"
          >
            {testingKey ? 'Verifying...' : 'Validate Key'}
          </button>
        </div>

        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            testResult.valid
              ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
              : 'bg-red-500/10 border-red-500/40 text-red-200'
          }`}>
            {testResult.valid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Storage and Reset */}
      <div className="glass-card p-6 rounded-2xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-soft-dim" />
            Studio Gallery Database Management
          </h4>
          <p className="text-xs text-soft-dim mt-1">
            Permanently clear metadata indices and reset storage tables.
          </p>
          {clearStatus && (
            <span className="text-xs text-neon-green block mt-1 font-mono">{clearStatus}</span>
          )}
        </div>

        <button
          onClick={handleClearData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset Gallery Records
        </button>
      </div>

    </div>
  );
};

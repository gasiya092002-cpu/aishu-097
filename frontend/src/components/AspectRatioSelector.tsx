import React from 'react';
import { Maximize2 } from 'lucide-react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

export const RATIOS = [
  { id: '1:1', label: '1:1', name: 'Square', useCase: 'Instagram / Avatar', boxClass: 'w-6 h-6' },
  { id: '4:5', label: '4:5', name: 'Portrait', useCase: 'Instagram Feed', boxClass: 'w-5 h-6' },
  { id: '9:16', label: '9:16', name: 'Vertical', useCase: 'Stories & Reels', boxClass: 'w-4 h-7' },
  { id: '16:9', label: '16:9', name: 'Landscape', useCase: 'YouTube & Desktop', boxClass: 'w-7 h-4' },
  { id: '3:2', label: '3:2', name: 'Photo', useCase: 'DSLR Standard', boxClass: 'w-6 h-4' },
  { id: '2:3', label: '2:3', name: 'Editorial', useCase: 'Posters & Print', boxClass: 'w-4 h-6' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-soft-light uppercase tracking-wider flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-electric" />
          Aspect Ratio
        </label>
        <span className="text-xs text-soft-dim font-mono">{selectedRatio}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {RATIOS.map((item) => {
          const isSelected = selectedRatio === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRatio(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-electric/15 border-electric text-electric-glow shadow-glow-blue'
                  : 'bg-surface-dark border-surface-border text-soft-gray hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="h-8 flex items-center justify-center mb-1.5">
                <div className={`border-2 rounded-sm ${isSelected ? 'border-electric-glow bg-electric/20' : 'border-soft-dim'} ${item.boxClass}`} />
              </div>
              <span className="font-semibold text-xs leading-none mb-0.5">{item.id}</span>
              <span className="text-[10px] text-soft-dim truncate max-w-[80px]">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

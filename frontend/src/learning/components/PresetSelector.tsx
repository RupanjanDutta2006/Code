import React, { useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { PresetInput } from '../core/types';

interface PresetSelectorProps {
  presets: PresetInput[];
  selectedPresetLabel: string;
  onSelectPreset: (preset: PresetInput) => void;
  onCustomInput?: (val: any) => void;
  simulationType: string;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  selectedPresetLabel,
  onSelectPreset,
  onCustomInput,
  simulationType,
}) => {
  const [customText, setCustomText] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleApplyCustom = () => {
    if (!customText.trim() || !onCustomInput) return;

    if (simulationType === 'array' || simulationType === 'linked-list' || simulationType === 'stack' || simulationType === 'queue') {
      const parsed = customText
        .split(/[,\s]+/)
        .map((x) => Number(x.trim()))
        .filter((n) => !isNaN(n));
      if (parsed.length > 0) {
        onCustomInput(parsed);
        setShowCustomModal(false);
      }
    } else {
      onCustomInput(customText);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-dark-400">
        Presets:
      </span>

      {presets.map((p) => {
        const isSelected = p.label === selectedPresetLabel;

        return (
          <button
            key={p.label}
            onClick={() => onSelectPreset(p)}
            className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
              isSelected
                ? 'bg-brand-500/20 border-brand-500/80 text-brand-600 dark:text-brand-300 font-bold shadow-sm'
                : 'bg-white/80 dark:bg-dark-800/80 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300 hover:border-slate-300 dark:hover:border-dark-600'
            }`}
            title={p.description}
          >
            {p.label}
          </button>
        );
      })}

      {/* Custom Input Button */}
      {onCustomInput && (
        <>
          <button
            onClick={() => setShowCustomModal(!showCustomModal)}
            className="px-3 py-1 rounded-xl text-xs font-medium border border-dashed border-slate-300 dark:border-dark-600 text-slate-600 dark:text-dark-300 hover:text-brand-500 hover:border-brand-500 flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Custom Input</span>
          </button>

          {showCustomModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl liquid-glass p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enter Custom Input
                </h3>
                <p className="text-xs text-slate-500 dark:text-dark-400">
                  Provide comma or space separated numbers (e.g. 5, 9, 2, 7, 1):
                </p>

                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. 45, 12, 89, 34, 23"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-slate-900 dark:text-white text-sm font-mono outline-none focus:border-brand-500"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 text-slate-700 dark:text-dark-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCustom}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/25"
                  >
                    Apply & Visualize
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

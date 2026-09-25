import React, { useRef } from 'react';
import { X, Upload, Check, RotateCcw, Image as ImageIcon, Sliders, Sparkles } from 'lucide-react';
import { useBackground, BACKGROUND_PRESET_OPTIONS } from '../context/BackgroundContext';

export const BackgroundPickerModal: React.FC = () => {
  const {
    activeBgUrl,
    currentBgId,
    selectPresetBg,
    uploadCustomBg,
    resetDefaultBg,
    isBgModalOpen,
    setIsBgModalOpen,
    bgOpacity,
    setBgOpacity,
    isCover,
    setIsCover,
  } = useBackground();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBgModalOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadCustomBg(file);
        setIsCover(true);
        // custom is handled
      } catch (err) {
        console.error(err);
      }
    }
  };

  const scenicPresets = BACKGROUND_PRESET_OPTIONS.filter((p) => p.category === 'scenic');
  const patternPresets = BACKGROUND_PRESET_OPTIONS.filter((p) => p.category === 'pattern');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-emerald-900/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-emerald-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ImageIcon className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                Website Appearance
              </span>
              <h2 className="text-lg font-bold font-cinzel">Choose Academy Background Image</h2>
            </div>
          </div>

          <button
            onClick={() => setIsBgModalOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pattern Presets (Primary) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Islamic Geometric Patterns (Selected Theme)</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                Subtle & Prestigious
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patternPresets.map((preset) => {
                const isSelected = currentBgId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPresetBg(preset.id)}
                    className={`relative rounded-2xl border p-3 text-left transition-all overflow-hidden flex items-center gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-[#faf9f6]">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 leading-snug">
                        {preset.name}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        {preset.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="bg-emerald-600 text-white p-1 rounded-full shadow-xs shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenic Images (Secondary) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Photographic Scenic Themes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scenicPresets.map((preset) => {
                const isSelected = currentBgId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPresetBg(preset.id)}
                    className={`relative rounded-2xl border text-left transition-all overflow-hidden group flex flex-col ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-md bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="font-bold text-xs text-slate-900 leading-tight">
                        {preset.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Opacity & Display Mode */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Background Image Intensity / Opacity</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {Math.round(bgOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={bgOpacity}
              onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Subtle (30%)</span>
              <span>Balanced (70%)</span>
              <span>Vivid (100%)</span>
            </div>
          </div>

          {/* Upload Custom Image & Reset */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-200">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload Your Own Image</span>
            </button>

            <button
              onClick={resetDefaultBg}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
              title="Reset to default mosque interior image"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsBgModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

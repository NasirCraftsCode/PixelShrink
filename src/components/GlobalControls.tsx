import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Minimize2, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Maximize2, 
  Palette, 
  Zap, 
  Wand2 
} from 'lucide-react';
import { ImageSettings, SupportedFormat, ResizeMode } from '../types';

interface GlobalControlsProps {
  settings: ImageSettings;
  onSettingsChange: (newSettings: Partial<ImageSettings>) => void;
  onApplyToAll: () => void;
  isProcessing: boolean;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({
  settings,
  onSettingsChange,
  onApplyToAll,
  isProcessing,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetSizeKb, setTargetSizeKb] = useState<string>(
    settings.targetMaxSizeBytes ? (settings.targetMaxSizeBytes / 1024).toString() : ''
  );

  // Preset handlers
  const applyPreset = (type: 'web' | 'ultra' | 'crisp' | 'social' | 'email' | 'ico') => {
    switch (type) {
      case 'web':
        onSettingsChange({
          format: 'webp',
          quality: 80,
          resizeMode: 'original',
          targetMaxSizeBytes: null,
        });
        setTargetSizeKb('');
        break;
      case 'ultra':
        onSettingsChange({
          format: 'webp',
          quality: 60,
          resizeMode: 'max_edge',
          maxEdge: 1600,
          targetMaxSizeBytes: 150 * 1024,
        });
        setTargetSizeKb('150');
        break;
      case 'crisp':
        onSettingsChange({
          format: 'png',
          quality: 95,
          resizeMode: 'original',
          targetMaxSizeBytes: null,
        });
        setTargetSizeKb('');
        break;
      case 'social':
        onSettingsChange({
          format: 'jpeg',
          quality: 85,
          resizeMode: 'max_edge',
          maxEdge: 1080,
          targetMaxSizeBytes: null,
        });
        setTargetSizeKb('');
        break;
      case 'email':
        onSettingsChange({
          format: 'jpeg',
          quality: 75,
          resizeMode: 'max_edge',
          maxEdge: 1280,
          targetMaxSizeBytes: 300 * 1024,
        });
        setTargetSizeKb('300');
        break;
      case 'ico':
        onSettingsChange({
          format: 'ico',
          quality: 100,
          resizeMode: 'dimensions',
          customWidth: 64,
          customHeight: 64,
          maintainAspectRatio: true,
          targetMaxSizeBytes: null,
        });
        setTargetSizeKb('');
        break;
    }
  };

  const handleTargetSizeChange = (val: string) => {
    setTargetSizeKb(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onSettingsChange({ targetMaxSizeBytes: Math.round(num * 1024) });
    } else {
      onSettingsChange({ targetMaxSizeBytes: null });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Presets Row */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              One-Click Optimization Presets
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Click to apply instant settings</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('web')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.format === 'webp' && settings.quality === 80 && !settings.targetMaxSizeBytes
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-indigo-400">
              <Zap className="w-3.5 h-3.5" /> Web Fast
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">WebP 80% • Small & Crisp</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ultra')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.targetMaxSizeBytes === 150 * 1024
                ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-400">
              <Minimize2 className="w-3.5 h-3.5" /> Ultra Squeeze
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">&lt; 150 KB Target</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('crisp')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.format === 'png'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Pro High-Def
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">PNG 95% • Maximum detail</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('social')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.format === 'jpeg' && settings.maxEdge === 1080
                ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-purple-400">
              <Maximize2 className="w-3.5 h-3.5" /> Social Media
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">1080px JPG • Instagram/X</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('email')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.targetMaxSizeBytes === 300 * 1024
                ? 'bg-sky-600/20 border-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-sky-400">
              <Target className="w-3.5 h-3.5" /> Email Friendly
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">&lt; 300 KB Attachment</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ico')}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
              settings.format === 'ico'
                ? 'bg-rose-600/20 border-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-400">
              <Palette className="w-3.5 h-3.5" /> Favicon .ICO
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">Website Multi-Size Icon</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-800/80">
        {/* 1. Target Format Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Output File Format
          </label>
          <select
            value={settings.format}
            onChange={(e) => onSettingsChange({ format: e.target.value as SupportedFormat })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="auto">Keep Original Format (Auto)</option>
            <option value="webp">WebP — Recommended (~40% smaller)</option>
            <option value="jpeg">JPEG / JPG — Universal compatibility</option>
            <option value="png">PNG — Lossless &amp; Transparency</option>
            <option value="avif">AVIF — Next-Gen High Efficiency</option>
            <option value="bmp">BMP — Bitmap Graphic</option>
            <option value="ico">ICO — Website Favicon Icon</option>
          </select>
          <p className="text-[11px] text-slate-400">
            {settings.format === 'webp' && '🌟 Best web format: lightweight with full alpha transparency.'}
            {settings.format === 'jpeg' && '📷 Great for complex photos, doesn’t support alpha transparency.'}
            {settings.format === 'png' && '🎨 Perfect for logos, illustrations, and transparent graphics.'}
            {settings.format === 'avif' && '⚡ Next-gen compression format for modern browsers.'}
            {settings.format === 'ico' && '🌐 Standard icon format embedded into website tab headers.'}
            {settings.format === 'auto' && '🔄 Maintains each image’s original extension.'}
          </p>
        </div>

        {/* 2. Quality Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Compression Quality
            </label>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                settings.quality >= 80
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : settings.quality >= 50
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/30'
              }`}
            >
              {settings.quality}%
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="100"
            step="1"
            value={settings.quality}
            onChange={(e) => onSettingsChange({ quality: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Small Size (10%)</span>
            <span>Balanced (75%)</span>
            <span>Max Quality (100%)</span>
          </div>
        </div>

        {/* 3. Target File Size Limit or Resize */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Target Max Size (Optional Auto-Fit)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="e.g. 200"
                value={targetSizeKb}
                onChange={(e) => handleTargetSizeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">KB</span>
            </div>
            {targetSizeKb && (
              <button
                type="button"
                onClick={() => handleTargetSizeChange('')}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                title="Clear max target limit"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Auto-calculates quality to guarantee file stays below KB limit.
          </p>
        </div>
      </div>

      {/* Resize Options Row */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Resize Mode
          </label>
          <select
            value={settings.resizeMode}
            onChange={(e) => onSettingsChange({ resizeMode: e.target.value as ResizeMode })}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="original">Original Dimensions (100%)</option>
            <option value="percentage">Percentage Scale (e.g. 50%)</option>
            <option value="max_edge">Max Edge Constraint (e.g. 1920px)</option>
            <option value="dimensions">Custom Width × Height</option>
          </select>
        </div>

        {settings.resizeMode === 'percentage' && (
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Scale Factor</span>
              <span className="font-mono text-indigo-400">{settings.resizePercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.resizePercent}
              onChange={(e) => onSettingsChange({ resizePercent: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        )}

        {settings.resizeMode === 'max_edge' && (
          <div>
            <label className="block text-xs text-slate-300 mb-1">Max Longest Edge (px)</label>
            <select
              value={settings.maxEdge}
              onChange={(e) => onSettingsChange({ maxEdge: parseInt(e.target.value, 10) })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
            >
              <option value="3840">3840 px (4K Ultra HD)</option>
              <option value="2560">2560 px (2K QHD)</option>
              <option value="1920">1920 px (Full HD 1080p)</option>
              <option value="1280">1280 px (HD 720p)</option>
              <option value="1080">1080 px (Social Square/Standard)</option>
              <option value="800">800 px (Blog Web Card)</option>
              <option value="500">500 px (Thumbnail)</option>
            </select>
          </div>
        )}

        {settings.resizeMode === 'dimensions' && (
          <div className="flex items-center gap-2">
            <div>
              <label className="block text-[10px] text-slate-400">Width (px)</label>
              <input
                type="number"
                value={settings.customWidth || ''}
                onChange={(e) => onSettingsChange({ customWidth: parseInt(e.target.value, 10) || 0 })}
                placeholder="1920"
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <span className="text-slate-500 pt-3">×</span>
            <div>
              <label className="block text-[10px] text-slate-400">Height (px)</label>
              <input
                type="number"
                value={settings.customHeight || ''}
                onChange={(e) => onSettingsChange({ customHeight: parseInt(e.target.value, 10) || 0 })}
                placeholder="1080"
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 md:pt-4">
          <button
            type="button"
            onClick={onApplyToAll}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sliders className="w-3.5 h-3.5" />
            {isProcessing ? 'Processing Images...' : 'Re-Apply Settings to All'}
          </button>
        </div>
      </div>

      {/* Advanced Options Accordion */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Advanced Studio Tweaks (Transparency Color, Filters &amp; EXIF)</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            {/* Background Color Picker for JPG */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Alpha Matte Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor || '#ffffff'}
                  onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                  className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400">{settings.backgroundColor}</span>
              </div>
              <span className="text-[10px] text-slate-500">Used when converting transparent PNG to JPG</span>
            </div>

            {/* Smart Sharpening */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sharpen}
                  onChange={(e) => onSettingsChange({ sharpen: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <span className="text-slate-300 font-medium">Smart Sharpen Filter</span>
              </label>
              <span className="text-[10px] text-slate-500 mt-1">Enhances fine edge clarity after downscaling</span>
            </div>

            {/* Grayscale Mode */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.grayscale}
                  onChange={(e) => onSettingsChange({ grayscale: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <span className="text-slate-300 font-medium">Monochrome Grayscale</span>
              </label>
              <span className="text-[10px] text-slate-500 mt-1">Convert photo to clean black &amp; white</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

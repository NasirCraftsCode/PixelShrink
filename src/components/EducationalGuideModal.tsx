import React from 'react';
import { X, ShieldCheck, Check, Lightbulb, Zap, Globe, Sparkles } from 'lucide-react';

interface EducationalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalGuideModal: React.FC<EducationalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Image Format &amp; Compression Guide</h2>
            <p className="text-xs text-slate-400">
              Maximize website speed, Core Web Vitals, and visual fidelity.
            </p>
          </div>
        </div>

        {/* Privacy Highlight Box */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200 leading-relaxed">
            <strong className="text-white block font-semibold mb-0.5">100% In-Browser Privacy Guarantee:</strong>
            All compression, downscaling, and format conversion calculations are executed locally on your device using HTML5 Canvas &amp; Web Workers. Your images are never sent over the internet or saved to any server.
          </div>
        </div>

        {/* Format Matrix Table */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Format Comparison Matrix
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* WebP */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-indigo-300">WebP (Recommended)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">Best For Web</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Modern standard format developed by Google. Provides 25–45% smaller file sizes than JPG with full alpha transparency support.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <Check className="w-3 h-3" /> Supports Alpha Transparency
              </div>
            </div>

            {/* AVIF */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-300">AVIF</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">Next-Gen</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Ultra-high compression efficiency based on the AV1 video codec. Superb for high-resolution graphics and HDR content.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-400">
                <Zap className="w-3 h-3" /> Ultra Small Footprint
              </div>
            </div>

            {/* JPEG */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-300">JPEG / JPG</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">Universal</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                The world’s most widely supported photograph format. Ideal for cameras, emails, print documents, and legacy hardware.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
                <Globe className="w-3 h-3" /> 100% Device Compatibility
              </div>
            </div>

            {/* PNG */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-pink-300">PNG</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/30">Lossless</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Pixel-perfect lossless format. Essential for logos, screenshots with sharp text, vector assets, and UI design mockups.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-pink-400">
                <Sparkles className="w-3 h-3" /> Zero Quality Degradation
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Got it, Let's Optimize!
          </button>
        </div>
      </div>
    </div>
  );
};

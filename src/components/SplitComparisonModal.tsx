import React, { useState } from 'react';
import { X, ZoomIn, Download, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { ProcessedImageItem } from '../types';
import { formatBytes, downloadImage } from '../utils/imageProcessor';

interface SplitComparisonModalProps {
  item: ProcessedImageItem | null;
  onClose: () => void;
}

export const SplitComparisonModal: React.FC<SplitComparisonModalProps> = ({ item, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);

  if (!item || !item.compressedDataUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg truncate max-w-md">
              Split Visual Inspector: {item.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-slate-300">{formatBytes(item.originalSize)}</span>
              <ArrowRight className="w-3 h-3 text-indigo-400" />
              <span className="font-mono font-bold text-emerald-400">{formatBytes(item.compressedSize)}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                -{item.savingsPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Zoom & Close Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <ZoomIn className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            {([1, 2, 4] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-colors ${
                  zoomLevel === z
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>

          <button
            onClick={() => downloadImage(item)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Split Comparison Canvas Area */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full my-4 flex items-center justify-center overflow-auto rounded-2xl bg-slate-950/90 border border-slate-800 p-2 select-none">
        <div
          className="relative overflow-hidden rounded-xl max-h-[70vh] flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Original Image (Background Full View) */}
          <img
            src={item.originalDataUrl}
            alt="Original"
            className="max-h-[65vh] max-w-full object-contain pointer-events-none"
          />

          {/* Compressed Image (Clipped Left Layer) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={item.compressedDataUrl}
              alt="Compressed"
              className="max-h-[65vh] max-w-none w-full h-full object-contain pointer-events-none"
            />
          </div>

          {/* Dividing Vertical Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 via-pink-500 to-indigo-400 shadow-2xl shadow-indigo-500 pointer-events-none z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-500/50">
              <span className="text-[10px] text-indigo-300 font-bold">⇄</span>
            </div>
          </div>

          {/* Interactive Range Input spanning over the entire frame */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          {/* Left / Right HUD Badges */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-indigo-500/40 text-xs font-mono text-indigo-300 z-20 pointer-events-none shadow-lg">
            <span className="font-bold">COMPRESSED ({item.compressedFormat.toUpperCase()})</span>: {formatBytes(item.compressedSize)}
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-300 z-20 pointer-events-none shadow-lg">
            <span className="font-bold">ORIGINAL ({item.originalFormat.toUpperCase()})</span>: {formatBytes(item.originalSize)}
          </div>
        </div>
      </div>

      {/* Footer Instructions & Slider scrubber */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Drag the divider line left or right to inspect pixel fidelity side-by-side.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-72">
          <span className="text-[11px] font-mono">Curtain:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="font-mono text-indigo-400 w-10">{Math.round(sliderPos)}%</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  SplitSquareVertical, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { ProcessedImageItem, SupportedFormat } from '../types';
import { formatBytes, downloadImage } from '../utils/imageProcessor';

interface ImageCardProps {
  item: ProcessedImageItem;
  onRemove: (id: string) => void;
  onOpenSplitLoupe: (item: ProcessedImageItem) => void;
  onUpdateItemSettings: (id: string, customSettings: any) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  onRemove,
  onOpenSplitLoupe,
  onUpdateItemSettings,
}) => {
  const [showItemSettings, setShowItemSettings] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const isComplete = item.status === 'done';
  const isProcessing = item.status === 'processing';
  const isError = item.status === 'error';

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all hover:shadow-indigo-500/10">
      {/* Main Grid: Visual Media + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
        {/* Thumbnail Preview Area (4 cols on md) */}
        <div className="md:col-span-4 relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center select-none">
          {isComplete && item.compressedDataUrl ? (
            <div className="relative w-full h-full">
              {/* Split comparison preview container */}
              <img
                src={item.originalDataUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={item.compressedDataUrl}
                  alt="Compressed"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 shadow-md shadow-indigo-500/50 pointer-events-none z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500 border border-white flex items-center justify-center shadow-lg">
                  <span className="text-[7px] text-white font-bold">⇄</span>
                </div>
              </div>

              {/* Invisible interactive slider range */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                title="Drag to compare Original vs Compressed"
              />

              {/* Split badges */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-indigo-300 pointer-events-none z-10">
                Compressed
              </div>
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-slate-300 pointer-events-none z-10">
                Original
              </div>
            </div>
          ) : (
            <img
              src={item.originalDataUrl}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          )}

          {/* Processing Loading Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-30">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <span className="text-xs font-medium text-slate-300">Compressing...</span>
            </div>
          )}

          {/* Error Overlay */}
          {isError && (
            <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-30">
              <AlertCircle className="w-6 h-6 text-rose-400 mb-1" />
              <span className="text-xs font-semibold text-rose-200">Error processing</span>
              <span className="text-[10px] text-rose-300/80">{item.errorMessage || 'Invalid image'}</span>
            </div>
          )}
        </div>

        {/* Info & Stats Section (5 cols on md) */}
        <div className="md:col-span-5 space-y-2">
          {/* File Name & Format Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-white truncate max-w-[200px]" title={item.name}>
              {item.name}
            </h4>
            <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              <span>{item.originalFormat.toUpperCase()}</span>
              <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
              <span className="font-bold text-indigo-300">{item.compressedFormat.toUpperCase()}</span>
            </div>
          </div>

          {/* Size Reduction Statistics */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs text-slate-400 line-through">
              {formatBytes(item.originalSize)}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="text-sm font-bold text-white font-mono">
              {isComplete ? formatBytes(item.compressedSize) : '—'}
            </span>

            {isComplete && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  item.savingsPercent > 0
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.savingsPercent > 0 ? `-${item.savingsPercent}%` : '0%'}
              </span>
            )}
          </div>

          {/* Dimensions info */}
          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <span>
              Dim: {item.originalWidth}×{item.originalHeight}px
              {isComplete && (item.compressedWidth !== item.originalWidth || item.compressedHeight !== item.originalHeight) && (
                <span className="text-indigo-400 font-semibold ml-1">
                  ➔ {item.compressedWidth}×{item.compressedHeight}px
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons (3 cols on md) */}
        <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
          {isComplete && (
            <button
              type="button"
              onClick={() => downloadImage(item)}
              className="flex-1 md:w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {isComplete && (
              <button
                type="button"
                onClick={() => onOpenSplitLoupe(item)}
                title="Open Split Quality Loupe Inspector"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <SplitSquareVertical className="w-4 h-4 text-indigo-400" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowItemSettings(!showItemSettings)}
              title="Individual Image Settings"
              className={`p-2 rounded-xl border transition-colors ${
                showItemSettings
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              title="Remove image"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Per-Item Custom Settings Popover Panel */}
      {showItemSettings && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 animate-fade-in text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Override Settings for "{item.name}"</span>
            <button
              type="button"
              onClick={() => setShowItemSettings(false)}
              className="text-slate-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Format</label>
              <select
                value={item.customSettings?.format || 'auto'}
                onChange={(e) =>
                  onUpdateItemSettings(item.id, {
                    ...item.customSettings,
                    format: e.target.value as SupportedFormat,
                  })
                }
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              >
                <option value="auto">Use Global Format</option>
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="avif">AVIF</option>
                <option value="bmp">BMP</option>
                <option value="ico">ICO</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Quality: {item.customSettings?.quality ?? 80}%
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={item.customSettings?.quality ?? 80}
                onChange={(e) =>
                  onUpdateItemSettings(item.id, {
                    ...item.customSettings,
                    quality: parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Max (KB)</label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={
                  item.customSettings?.targetMaxSizeBytes
                    ? item.customSettings.targetMaxSizeBytes / 1024
                    : ''
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateItemSettings(item.id, {
                    ...item.customSettings,
                    targetMaxSizeBytes: !isNaN(val) && val > 0 ? val * 1024 : null,
                  });
                }}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

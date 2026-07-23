import React, { useState } from 'react';
import { DownloadCloud, Trash2, Zap, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { ProcessedImageItem } from '../types';
import { formatBytes } from '../utils/imageProcessor';

interface BatchSummaryBarProps {
  items: ProcessedImageItem[];
  onClearAll: () => void;
}

export const BatchSummaryBar: React.FC<BatchSummaryBarProps> = ({ items, onClearAll }) => {
  const [isZipping, setIsZipping] = useState(false);

  if (items.length === 0) return null;

  const totalOriginal = items.reduce((acc, cur) => acc + cur.originalSize, 0);
  const totalCompressed = items.reduce((acc, cur) => acc + (cur.compressedSize || cur.originalSize), 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const percentSaved =
    totalOriginal > 0 ? parseFloat(((totalSaved / totalOriginal) * 100).toFixed(1)) : 0;

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.compressedBlob) {
          const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
          const ext = item.compressedFormat === 'jpeg' ? 'jpg' : item.compressedFormat;
          zip.file(`${baseName}-compressed.${ext}`, item.compressedBlob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `pixelshift-optimized-bundle-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.85 },
          colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b'],
        });
      } catch {
        // confetti fallback safe
      }
    } catch (e) {
      console.error('ZIP generation error', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="sticky bottom-4 z-30 max-w-5xl mx-auto w-full px-4 animate-slide-up">
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 backdrop-blur-xl shadow-2xl shadow-indigo-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Overall Savings Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 shadow-lg shadow-emerald-500/20 text-white">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">
                Batch Progress ({items.length} {items.length === 1 ? 'Image' : 'Images'})
              </span>
              {percentSaved > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  -{percentSaved}% Smaller
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-slate-400 line-through font-mono">
                {formatBytes(totalOriginal)}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {formatBytes(totalCompressed)}
              </span>
              {totalSaved > 0 && (
                <span className="text-xs font-semibold text-emerald-400">
                  (Saved {formatBytes(totalSaved)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Batch ZIP Download CTA */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Clear all images"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping || items.every((i) => i.status !== 'done')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isZipping ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Zipping Images...
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                Download All as ZIP ({items.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

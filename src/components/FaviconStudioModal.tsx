import React, { useState } from 'react';
import { X, Copy, Check, Palette, Sparkles } from 'lucide-react';
import { ProcessedImageItem } from '../types';
import { downloadImage } from '../utils/imageProcessor';

interface FaviconStudioModalProps {
  item: ProcessedImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FaviconStudioModal: React.FC<FaviconStudioModalProps> = ({ item, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const htmlSnippet = `<!-- Standard Website Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const previewImg = item.compressedDataUrl || item.originalDataUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Favicon &amp; App Icon Studio</h2>
            <p className="text-xs text-slate-400">
              Live browser tab &amp; device icon simulation for <strong className="text-slate-200">{item.name}</strong>
            </p>
          </div>
        </div>

        {/* Simulation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* 1. Chrome Dark Browser Tab Mockup */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Browser Tab (16×16 px)
            </span>
            <div className="rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 flex items-center gap-2">
              <img
                src={previewImg}
                alt="Favicon preview"
                className="w-4 h-4 rounded object-cover shadow-sm"
              />
              <span className="text-xs text-slate-200 font-medium truncate">My Awesome App — Tab</span>
            </div>
          </div>

          {/* 2. Apple Touch Icon iOS Mockup */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Apple Touch Icon (180×180 px)
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-900 flex items-center justify-center p-1">
                <img
                  src={previewImg}
                  alt="Apple Touch Icon"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-semibold block">iOS Home Screen</span>
                <span className="text-[10px] text-slate-500">Auto rounded squircle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy HTML Snippet */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Embed HTML into your &lt;head&gt;
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto">
            {htmlSnippet}
          </pre>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => downloadImage(item)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Download .ICO Favicon File
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal, 
  FileCode2, 
  Zap, 
  SplitSquareVertical,
  HelpCircle,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'compress' | 'convert' | 'batch' | 'compare';
  setActiveTab: (tab: 'compress' | 'convert' | 'batch' | 'compare') => void;
  totalSavedBytes: number;
  totalImagesCount: number;
  onOpenGuide: () => void;
  onOpenPublish: () => void;
}
import { formatBytes } from '../utils/imageProcessor';

interface NavbarProps {
  activeTab: 'compress' | 'convert' | 'batch' | 'compare';
  setActiveTab: (tab: 'compress' | 'convert' | 'batch' | 'compare') => void;
  totalSavedBytes: number;
  totalImagesCount: number;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalSavedBytes,
  totalImagesCount,
  onOpenGuide,
  onOpenPublish,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PixelShift<span className="text-indigo-400">.Pro</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Studio Suite
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 leading-none">
              Client-Side Image Compressor & Format Converter
            </p>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('compress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compress'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Compressor
          </button>

          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'convert'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Format Converter
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'batch'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Batch Studio
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Split Loupe
          </button>
        </nav>

        {/* Right Info & Privacy Metric */}
        <div className="flex items-center gap-3">
          {totalSavedBytes > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium animate-fade-in shadow-inner">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span>Saved <strong className="font-bold text-emerald-200">{formatBytes(totalSavedBytes)}</strong> ({totalImagesCount} {totalImagesCount === 1 ? 'file' : 'files'})</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline font-medium">100% In-Browser</span>
          </div>

          <button
            onClick={onOpenGuide}
            title="Image Formats & Compression Guide"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            title="Publish website publicly"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish / Share</span>
          </button>
        </div>
      </div>
    </header>
  );
};

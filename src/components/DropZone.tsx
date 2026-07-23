import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, FolderArchive, ClipboardCheck } from 'lucide-react';
import { generateSampleImages } from '../utils/sampleImages';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  hasImages: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, hasImages }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [justPasted, setJustPasted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const files: File[] = [];
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              files.push(file);
            }
          }
        }
        if (files.length > 0) {
          onFilesSelected(files);
          setJustPasted(true);
          setTimeout(() => setJustPasted(false), 3000);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith('image/') || f.name.match(/\.(png|jpe?g|webp|avif|svg|bmp|ico|gif)$/i)
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
    // reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSample = (sampleId: string) => {
    const samples = generateSampleImages();
    const target = samples.find((s) => s.id === sampleId);
    if (target) {
      onFilesSelected([target.file]);
    }
  };

  const loadAllSamples = () => {
    const samples = generateSampleImages();
    onFilesSelected(samples.map((s) => s.file));
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/20 scale-[1.008]'
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80 shadow-xl shadow-slate-950/40'
        } ${hasImages ? 'p-6 sm:p-8' : 'p-10 sm:p-14'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.png,.jpg,.jpeg,.webp,.avif,.svg,.bmp,.ico,.gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated Glow Icon */}
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            Drop your images here, or <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-500/50">browse files</span>
          </h3>

          <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-4">
            Supports batch upload, high-res photos, and clipboard pasting (<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">Cmd+V</kbd>)
          </p>

          {/* Formats support pill bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {['JPEG', 'PNG', 'WEBP', 'AVIF', 'SVG', 'BMP', 'ICO'].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {fmt}
              </span>
            ))}
          </div>

          {justPasted && (
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-emerald-300 text-xs animate-bounce">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Image pasted from clipboard successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Sample Image Buttons to test right away without files on disk */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>No files at hand? Try high-res samples:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample('sample-sunset');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-300 hover:bg-slate-800 transition-colors text-[11px] text-slate-300"
          >
            <ImageIcon className="w-3 h-3 text-amber-400" />
            🌄 Sunset Photo
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample('sample-neon');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:text-pink-300 hover:bg-slate-800 transition-colors text-[11px] text-slate-300"
          >
            <Sparkles className="w-3 h-3 text-pink-400" />
            ⚡ Neon Art
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample('sample-icon');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-800 transition-colors text-[11px] text-slate-300"
          >
            💎 Alpha Badge
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadAllSamples();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition-colors text-[11px] font-medium"
          >
            <FolderArchive className="w-3 h-3" />
            Load All (3 Samples)
          </button>
        </div>
      </div>
    </div>
  );
};

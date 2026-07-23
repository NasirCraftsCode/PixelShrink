import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DropZone } from './components/DropZone';
import { GlobalControls } from './components/GlobalControls';
import { ImageCard } from './components/ImageCard';
import { BatchSummaryBar } from './components/BatchSummaryBar';
import { SplitComparisonModal } from './components/SplitComparisonModal';
import { EducationalGuideModal } from './components/EducationalGuideModal';
import { FaviconStudioModal } from './components/FaviconStudioModal';
import { PublishGuideModal } from './components/PublishGuideModal';
import { ImageSettings, ProcessedImageItem } from './types';
import { processImage } from './utils/imageProcessor';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  DownloadCloud, 
  FileCheck,
  FileCode2,
  SlidersHorizontal,
  Layers,
  SplitSquareVertical
} from 'lucide-react';

const defaultSettings: ImageSettings = {
  format: 'webp',
  quality: 80,
  resizeMode: 'original',
  resizePercent: 100,
  customWidth: 0,
  customHeight: 0,
  maxEdge: 1920,
  maintainAspectRatio: true,
  targetMaxSizeBytes: null,
  backgroundColor: '#ffffff',
  stripMetadata: true,
  grayscale: false,
  sharpen: false,
};

export function App() {
  const [activeTab, setActiveTab] = useState<'compress' | 'convert' | 'batch' | 'compare'>('compress');
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedForLoupe, setSelectedForLoupe] = useState<ProcessedImageItem | null>(null);
  const [selectedForFavicon, setSelectedForFavicon] = useState<ProcessedImageItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Helper to read a File into a Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Process a list of items sequentially/concurrently
  const runCompression = useCallback(
    async (itemsToProcess: ProcessedImageItem[], currentSettings: ImageSettings) => {
      setIsProcessing(true);

      const updatedList = [...itemsToProcess];
      for (let i = 0; i < updatedList.length; i++) {
        updatedList[i] = { ...updatedList[i], status: 'processing' };
        setItems([...updatedList]);

        const processed = await processImage(updatedList[i], currentSettings);
        updatedList[i] = processed;
        setItems([...updatedList]);
      }

      setIsProcessing(false);
    },
    []
  );

  // Handle new incoming files from dropzone or sample buttons
  const handleFilesSelected = async (files: File[]) => {
    const newItems: ProcessedImageItem[] = [];

    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const dataUrl = await readFileAsDataUrl(file);

      // Extract format extension
      const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpeg';

      // Load dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => {
        img.onload = res;
        img.onerror = res;
      });

      newItems.push({
        id,
        file,
        name: file.name,
        originalSize: file.size,
        originalWidth: img.naturalWidth || 800,
        originalHeight: img.naturalHeight || 600,
        originalFormat: ext,
        originalDataUrl: dataUrl,
        compressedBlob: null,
        compressedDataUrl: null,
        compressedSize: 0,
        compressedWidth: img.naturalWidth || 800,
        compressedHeight: img.naturalHeight || 600,
        compressedFormat: settings.format === 'auto' ? 'webp' : (settings.format as any),
        savingsBytes: 0,
        savingsPercent: 0,
        status: 'idle',
      });
    }

    const combined = [...items, ...newItems];
    setItems(combined);
    runCompression(combined, settings);
  };

  // Re-run compression for all items with updated settings
  const handleSettingsChange = (partial: Partial<ImageSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
  };

  const handleApplyToAll = () => {
    if (items.length > 0) {
      runCompression(items, settings);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleUpdateItemSettings = async (id: string, customSettings: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, customSettings };
      }
      return item;
    });
    setItems(updated);

    const targetItem = updated.find((i) => i.id === id);
    if (targetItem) {
      const processed = await processImage(targetItem, settings);
      setItems((prev) => prev.map((i) => (i.id === id ? processed : i)));
    }
  };

  // Calculate global savings metrics
  const totalSavedBytes = items.reduce((acc, cur) => acc + (cur.savingsBytes || 0), 0);

  // Keyboard shortcut Ctrl+Z or Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedForLoupe(null);
        setSelectedForFavicon(null);
        setIsGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-24">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSavedBytes={totalSavedBytes}
        totalImagesCount={items.length}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Mode Navigation Indicators on Mobile/Tablet */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-2">
          <button
            onClick={() => setActiveTab('compress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
              activeTab === 'compress' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Compressor
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
              activeTab === 'convert' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> Converter
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
              activeTab === 'batch' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Batch Studio
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
              activeTab === 'compare' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" /> Split Loupe
          </button>
        </div>

        {/* Hero Banner with glowing badge */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Next-Gen Web Image Compression &amp; Format Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Shrink Image Size,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Quality Loss
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Convert JPG, PNG, WebP, AVIF, BMP, and ICO files directly inside your browser. 100% private, instantaneous processing with zero server uploads.
          </p>
        </section>

        {/* Global Controls & Presets Box */}
        <GlobalControls
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onApplyToAll={handleApplyToAll}
          isProcessing={isProcessing}
        />

        {/* Drag and Drop Zone */}
        <DropZone onFilesSelected={handleFilesSelected} hasImages={items.length > 0} />

        {/* Processed Images Grid / List */}
        {items.length > 0 && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Processed Files ({items.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={handleApplyToAll}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Re-compress All</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onOpenSplitLoupe={(i) => {
                    if (settings.format === 'ico' || item.compressedFormat === 'ico') {
                      setSelectedForFavicon(i);
                    } else {
                      setSelectedForLoupe(i);
                    }
                  }}
                  onUpdateItemSettings={handleUpdateItemSettings}
                />
              ))}
            </div>
          </section>
        )}

        {/* Feature Highlights (Visible when no images or as footer cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">100% Private &amp; Secure</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No photos or graphic files are uploaded to any server. All calculations happen locally inside your web browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Smart Target-Size Solver</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need images under 200 KB or 500 KB for web uploads or email forms? Our iterative solver automatically adjusts quality to match.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Batch ZIP Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Process 20+ photos simultaneously and download them in a single zipped archive with one effortless click.
            </p>
          </div>
        </section>
      </main>

      {/* Floating Bottom Batch Summary Bar */}
      <BatchSummaryBar items={items} onClearAll={handleClearAll} />

      {/* Fullscreen Interactive Split Loupe Modal */}
      {selectedForLoupe && (
        <SplitComparisonModal
          item={selectedForLoupe}
          onClose={() => setSelectedForLoupe(null)}
        />
      )}

      {/* Favicon & App Icon Studio Modal */}
      {selectedForFavicon && (
        <FaviconStudioModal
          item={selectedForFavicon}
          isOpen={true}
          onClose={() => setSelectedForFavicon(null)}
        />
      )}

      {/* Educational Formats Guide Modal */}
      <EducationalGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Public Deployment & Sharing Guide Modal */}
      <PublishGuideModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
      />
    </div>
  );
}

export default App;

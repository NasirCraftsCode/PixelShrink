export type SupportedFormat = 'auto' | 'jpeg' | 'png' | 'webp' | 'avif' | 'bmp' | 'ico';

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'bmp' | 'ico';

export type ResizeMode = 'original' | 'percentage' | 'dimensions' | 'max_edge';

export interface ImageSettings {
  format: SupportedFormat;
  quality: number; // 1 to 100
  resizeMode: ResizeMode;
  resizePercent: number; // 10 to 100
  customWidth: number;
  customHeight: number;
  maxEdge: number;
  maintainAspectRatio: boolean;
  targetMaxSizeBytes: number | null; // e.g. 200 * 1024 for 200KB
  backgroundColor: string; // for transparency conversion to JPG e.g. '#ffffff'
  stripMetadata: boolean;
  grayscale: boolean;
  sharpen: boolean;
}

export interface ProcessedImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  originalDataUrl: string;

  // Processed outcome
  compressedBlob: Blob | null;
  compressedDataUrl: string | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedFormat: OutputFormat;
  savingsBytes: number;
  savingsPercent: number;

  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;

  // Per-item override settings if customized
  customSettings?: Partial<ImageSettings>;
}

export interface PresetConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  settings: Partial<ImageSettings>;
}

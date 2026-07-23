import { ImageSettings, OutputFormat, ProcessedImageItem, SupportedFormat } from '../types';

/**
 * Formats bytes to human-readable string (e.g., 1.45 MB, 320 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm)) + ' ' + sizes[safeI];
}

/**
 * Loads an image from a Data URL or Blob URL into an HTMLImageElement
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for processing'));
    img.src = url;
  });
}

/**
 * Encodes an HTMLCanvasElement into a multi-resolution or single-resolution .ICO binary Blob
 */
export async function canvasToIcoBlob(sourceCanvas: HTMLCanvasElement): Promise<Blob> {
  // We can render standard 16x16, 32x32, 48x48 icon frames into PNG payloads and pack into ICO binary structure
  const sizes = [16, 32, 48];
  const pngBlobs: { size: number; bytes: Uint8Array }[] = [];

  for (const s of sizes) {
    const c = document.createElement('canvas');
    c.width = s;
    c.height = s;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceCanvas, 0, 0, s, s);
      const blob = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/png'));
      if (blob) {
        const buffer = await blob.arrayBuffer();
        pngBlobs.push({ size: s, bytes: new Uint8Array(buffer) });
      }
    }
  }

  if (pngBlobs.length === 0) {
    // fallback to normal canvas png
    const fallback = await new Promise<Blob | null>((res) => sourceCanvas.toBlob(res, 'image/png'));
    return fallback || new Blob([], { type: 'image/x-icon' });
  }

  // ICO header: 6 bytes
  // ICONDIR: [0, 0] (reserved=0), [1, 0] (type=1 for ICO), [count, 0] (number of images)
  const count = pngBlobs.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const totalSize = offset + pngBlobs.reduce((acc, cur) => acc + cur.bytes.length, 0);
  const icoData = new Uint8Array(totalSize);
  const view = new DataView(icoData.buffer);

  // Header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type 1 = ICO
  view.setUint16(4, count, true); // image count

  let entryOffset = headerSize;
  for (let i = 0; i < count; i++) {
    const item = pngBlobs[i];
    const s = item.size >= 256 ? 0 : item.size;
    view.setUint8(entryOffset + 0, s); // width
    view.setUint8(entryOffset + 1, s); // height
    view.setUint8(entryOffset + 2, 0); // color palette count
    view.setUint8(entryOffset + 3, 0); // reserved
    view.setUint16(entryOffset + 4, 1, true); // color planes
    view.setUint16(entryOffset + 6, 32, true); // bits per pixel
    view.setUint32(entryOffset + 8, item.bytes.length, true); // bytes in resource
    view.setUint32(entryOffset + 12, offset, true); // offset of resource

    // copy PNG bytes
    icoData.set(item.bytes, offset);

    entryOffset += dirEntrySize;
    offset += item.bytes.length;
  }

  return new Blob([icoData], { type: 'image/x-icon' });
}

/**
 * Determine the resolved output MIME type from requested format & original file format
 */
export function resolveOutputFormat(
  requestedFormat: SupportedFormat,
  originalMimeOrExt: string
): OutputFormat {
  if (requestedFormat !== 'auto') {
    return requestedFormat as OutputFormat;
  }
  const clean = originalMimeOrExt.toLowerCase();
  if (clean.includes('png')) return 'png';
  if (clean.includes('webp')) return 'webp';
  if (clean.includes('avif')) return 'avif';
  if (clean.includes('bmp')) return 'bmp';
  if (clean.includes('ico')) return 'ico';
  return 'jpeg';
}

/**
 * Calculates final dimensions based on resize mode and constraints
 */
export function calculateDimensions(
  origW: number,
  origH: number,
  settings: ImageSettings
): { width: number; height: number } {
  let w = origW;
  let h = origH;

  switch (settings.resizeMode) {
    case 'percentage': {
      const factor = Math.max(1, Math.min(100, settings.resizePercent)) / 100;
      w = Math.max(1, Math.round(origW * factor));
      h = Math.max(1, Math.round(origH * factor));
      break;
    }
    case 'dimensions': {
      if (settings.maintainAspectRatio) {
        const aspect = origW / origH;
        if (settings.customWidth && settings.customHeight) {
          // Fit inside bounding box
          const widthRatio = settings.customWidth / origW;
          const heightRatio = settings.customHeight / origH;
          const ratio = Math.min(widthRatio, heightRatio);
          w = Math.max(1, Math.round(origW * ratio));
          h = Math.max(1, Math.round(origH * ratio));
        } else if (settings.customWidth) {
          w = Math.max(1, settings.customWidth);
          h = Math.max(1, Math.round(w / aspect));
        } else if (settings.customHeight) {
          h = Math.max(1, settings.customHeight);
          w = Math.max(1, Math.round(h * aspect));
        }
      } else {
        w = Math.max(1, settings.customWidth || origW);
        h = Math.max(1, settings.customHeight || origH);
      }
      break;
    }
    case 'max_edge': {
      const max = settings.maxEdge || 1920;
      if (origW > max || origH > max) {
        if (origW >= origH) {
          w = max;
          h = Math.max(1, Math.round(origH * (max / origW)));
        } else {
          h = max;
          w = Math.max(1, Math.round(origW * (max / origH)));
        }
      }
      break;
    }
    case 'original':
    default:
      w = origW;
      h = origH;
      break;
  }

  return { width: w, height: h };
}

/**
 * Process a single image with given settings
 */
export async function processImage(
  item: ProcessedImageItem,
  globalSettings: ImageSettings
): Promise<ProcessedImageItem> {
  const mergedSettings: ImageSettings = {
    ...globalSettings,
    ...(item.customSettings || {}),
  };

  try {
    const img = await loadImage(item.originalDataUrl);
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;

    const { width: targetW, height: targetH } = calculateDimensions(origW, origH, mergedSettings);

    const outFormat = resolveOutputFormat(mergedSettings.format, item.originalFormat);

    // Render on canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('Canvas 2D context could not be initialized');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If format doesn't support alpha or background fill is requested
    const noAlphaFormats = ['jpeg', 'bmp'];
    if (noAlphaFormats.includes(outFormat) || mergedSettings.backgroundColor) {
      ctx.fillStyle = mergedSettings.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Apply Grayscale filter if enabled
    if (mergedSettings.grayscale) {
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        d[i] = gray;
        d[i + 1] = gray;
        d[i + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Apply Sharpen filter if enabled
    if (mergedSettings.sharpen) {
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const d = imgData.data;
      const copy = new Uint8ClampedArray(d);
      const w = targetW;
      const h = targetH;
      // 3x3 sharpen kernel: [0, -0.2, 0, -0.2, 1.8, -0.2, 0, -0.2, 0]
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            const idx = (y * w + x) * 4 + c;
            const top = ((y - 1) * w + x) * 4 + c;
            const bot = ((y + 1) * w + x) * 4 + c;
            const lft = (y * w + (x - 1)) * 4 + c;
            const rgt = (y * w + (x + 1)) * 4 + c;
            const val = 1.8 * copy[idx] - 0.2 * (copy[top] + copy[bot] + copy[lft] + copy[rgt]);
            d[idx] = Math.min(255, Math.max(0, val));
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Generate output blob
    let finalBlob: Blob | null = null;
    let finalQuality = mergedSettings.quality / 100;

    if (outFormat === 'ico') {
      finalBlob = await canvasToIcoBlob(canvas);
    } else {
      let mimeType = `image/${outFormat}`;
      if (outFormat === 'jpeg') mimeType = 'image/jpeg';
      if (outFormat === 'bmp') mimeType = 'image/bmp';

      // Check if Target Max Size is requested (smart iterative binary search)
      if (mergedSettings.targetMaxSizeBytes && mergedSettings.targetMaxSizeBytes > 0) {
        let lowQ = 0.05;
        let highQ = 0.95;
        let bestBlob: Blob | null = null;

        for (let iter = 0; iter < 6; iter++) {
          const testQ = (lowQ + highQ) / 2;
          const testBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, mimeType, testQ);
          });

          if (testBlob) {
            bestBlob = testBlob;
            if (testBlob.size > mergedSettings.targetMaxSizeBytes) {
              highQ = testQ;
            } else {
              lowQ = testQ;
            }
          }
        }
        finalBlob = bestBlob;
      } else {
        finalBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, finalQuality);
        });
      }

      // Fallback if browser doesn't support specific mime (e.g. avif or bmp)
      if (!finalBlob || finalBlob.size === 0) {
        finalBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', finalQuality);
        });
      }
    }

    if (!finalBlob) {
      throw new Error('Failed to encode image to output format');
    }

    const compressedDataUrl = URL.createObjectURL(finalBlob);
    const compressedSize = finalBlob.size;
    const savingsBytes = Math.max(0, item.originalSize - compressedSize);
    const savingsPercent =
      item.originalSize > 0
        ? parseFloat((((item.originalSize - compressedSize) / item.originalSize) * 100).toFixed(1))
        : 0;

    return {
      ...item,
      compressedBlob: finalBlob,
      compressedDataUrl,
      compressedSize,
      compressedWidth: targetW,
      compressedHeight: targetH,
      compressedFormat: outFormat,
      savingsBytes,
      savingsPercent,
      status: 'done',
      errorMessage: undefined,
    };
  } catch (err: any) {
    return {
      ...item,
      status: 'error',
      errorMessage: err?.message || 'Processing failed',
    };
  }
}

/**
 * Single file download helper
 */
export function downloadImage(item: ProcessedImageItem) {
  if (!item.compressedBlob) return;
  const link = document.createElement('a');
  const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
  const ext = item.compressedFormat === 'jpeg' ? 'jpg' : item.compressedFormat;
  link.download = `${baseName}-compressed.${ext}`;
  link.href = URL.createObjectURL(item.compressedBlob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

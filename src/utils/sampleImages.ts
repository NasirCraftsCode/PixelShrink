export interface SampleImageMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
  fileSizeEstimate: number;
  mimeType: string;
}

/**
 * Creates an in-memory high-res photographic/graphic data URL using HTML5 Canvas
 */
export function generateSampleImages(): {
  id: string;
  name: string;
  category: string;
  description: string;
  dataUrl: string;
  file: File;
}[] {
  const samples = [];

  // 1. Mountain Sunset (Vibrant Photo Scene 1920x1080)
  const c1 = document.createElement('canvas');
  c1.width = 1600;
  c1.height = 1000;
  const ctx1 = c1.getContext('2d');
  if (ctx1) {
    // Sky gradient
    const sky = ctx1.createLinearGradient(0, 0, 0, 800);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(0.3, '#312e81');
    sky.addColorStop(0.6, '#db2777');
    sky.addColorStop(0.8, '#f97316');
    sky.addColorStop(1, '#fde047');
    ctx1.fillStyle = sky;
    ctx1.fillRect(0, 0, 1600, 1000);

    // Sun
    const sun = ctx1.createRadialGradient(800, 600, 10, 800, 600, 240);
    sun.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sun.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)');
    sun.addColorStop(0.7, 'rgba(249, 115, 22, 0.4)');
    sun.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx1.fillStyle = sun;
    ctx1.beginPath();
    ctx1.arc(800, 600, 240, 0, Math.PI * 2);
    ctx1.fill();

    // Mountains back
    ctx1.fillStyle = '#4c1d95';
    ctx1.beginPath();
    ctx1.moveTo(0, 750);
    ctx1.lineTo(300, 480);
    ctx1.lineTo(650, 680);
    ctx1.lineTo(1050, 420);
    ctx1.lineTo(1400, 660);
    ctx1.lineTo(1600, 520);
    ctx1.lineTo(1600, 1000);
    ctx1.lineTo(0, 1000);
    ctx1.fill();

    // Mountains middle
    ctx1.fillStyle = '#1e1b4b';
    ctx1.beginPath();
    ctx1.moveTo(0, 820);
    ctx1.lineTo(450, 590);
    ctx1.lineTo(820, 750);
    ctx1.lineTo(1250, 540);
    ctx1.lineTo(1600, 780);
    ctx1.lineTo(1600, 1000);
    ctx1.lineTo(0, 1000);
    ctx1.fill();

    // Foreground lake reflection
    const lake = ctx1.createLinearGradient(0, 800, 0, 1000);
    lake.addColorStop(0, '#111827');
    lake.addColorStop(1, '#030712');
    ctx1.fillStyle = lake;
    ctx1.fillRect(0, 800, 1600, 200);

    // Lake shimmer lines
    ctx1.strokeStyle = 'rgba(253, 224, 71, 0.3)';
    ctx1.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      const y = 820 + i * 4.2;
      const spread = 200 + i * 12;
      ctx1.beginPath();
      ctx1.moveTo(800 - spread * Math.random(), y);
      ctx1.lineTo(800 + spread * Math.random(), y);
      ctx1.stroke();
    }
  }
  const url1 = c1.toDataURL('image/jpeg', 0.95);
  const blob1 = dataUrlToBlob(url1);
  const file1 = new File([blob1], 'golden-mountain-sunset.jpg', { type: 'image/jpeg' });

  samples.push({
    id: 'sample-sunset',
    name: 'golden-mountain-sunset.jpg',
    category: 'Landscape Photo (JPEG)',
    description: 'High-resolution gradient nature photo with complex color banding and lake reflections.',
    dataUrl: url1,
    file: file1,
  });

  // 2. Modern Cyberpunk Neon Art (PNG / High Contrast)
  const c2 = document.createElement('canvas');
  c2.width = 1200;
  c2.height = 1200;
  const ctx2 = c2.getContext('2d');
  if (ctx2) {
    ctx2.fillStyle = '#05050f';
    ctx2.fillRect(0, 0, 1200, 1200);

    // Glowing Neon Rings
    for (let r = 100; r <= 480; r += 70) {
      ctx2.beginPath();
      ctx2.arc(600, 600, r, 0, Math.PI * 2);
      ctx2.strokeStyle = r % 140 === 0 ? '#06b6d4' : '#ec4899';
      ctx2.lineWidth = 8;
      ctx2.shadowColor = ctx2.strokeStyle;
      ctx2.shadowBlur = 24;
      ctx2.stroke();
    }

    // Grid floor
    ctx2.shadowBlur = 0;
    ctx2.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx2.lineWidth = 1.5;
    for (let i = 0; i < 1200; i += 60) {
      ctx2.beginPath();
      ctx2.moveTo(i, 700);
      ctx2.lineTo(i * 1.8 - 400, 1200);
      ctx2.stroke();
    }
  }
  const url2 = c2.toDataURL('image/png');
  const blob2 = dataUrlToBlob(url2);
  const file2 = new File([blob2], 'cyberpunk-neon-matrix.png', { type: 'image/png' });

  samples.push({
    id: 'sample-neon',
    name: 'cyberpunk-neon-matrix.png',
    category: 'Digital Art (PNG)',
    description: 'Complex glowing neon graphics with sharp line details and saturated highlights.',
    dataUrl: url2,
    file: file2,
  });

  // 3. Transparent 3D App Icon / Graphic (Transparent PNG)
  const c3 = document.createElement('canvas');
  c3.width = 800;
  c3.height = 800;
  const ctx3 = c3.getContext('2d');
  if (ctx3) {
    ctx3.clearRect(0, 0, 800, 800);
    // Draw rounded translucent badge
    const grad = ctx3.createLinearGradient(150, 150, 650, 650);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#ec4899');

    ctx3.fillStyle = grad;
    ctx3.beginPath();
    ctx3.roundRect(160, 160, 480, 480, 96);
    ctx3.fill();

    // Gloss overlay
    ctx3.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx3.beginPath();
    ctx3.roundRect(190, 190, 420, 200, 60);
    ctx3.fill();

    // Central Icon glyph
    ctx3.fillStyle = '#ffffff';
    ctx3.beginPath();
    ctx3.arc(400, 400, 90, 0, Math.PI * 2);
    ctx3.fill();

    ctx3.fillStyle = '#6366f1';
    ctx3.beginPath();
    ctx3.moveTo(375, 340);
    ctx3.lineTo(460, 400);
    ctx3.lineTo(375, 460);
    ctx3.closePath();
    ctx3.fill();
  }
  const url3 = c3.toDataURL('image/png');
  const blob3 = dataUrlToBlob(url3);
  const file3 = new File([blob3], 'crystal-app-badge.png', { type: 'image/png' });

  samples.push({
    id: 'sample-icon',
    name: 'crystal-app-badge.png',
    category: 'Transparent Logo (PNG)',
    description: 'Alpha transparency badge perfect for testing WebP transparency vs JPG white background.',
    dataUrl: url3,
    file: file3,
  });

  return samples;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

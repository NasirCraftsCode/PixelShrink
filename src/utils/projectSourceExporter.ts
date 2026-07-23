import JSZip from 'jszip';

export async function downloadProjectSourceZip() {
  const zip = new JSZip();

  // Root config files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'pixelshift-pro',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          'canvas-confetti': '^1.9.4',
          clsx: '^2.1.1',
          jszip: '^3.10.1',
          'lucide-react': '^1.16.0',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'tailwind-merge': '^3.4.0',
        },
        devDependencies: {
          '@tailwindcss/vite': '^4.0.0',
          '@types/canvas-confetti': '^1.9.0',
          '@types/node': '^22.0.0',
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          '@vitejs/plugin-react': '^4.3.4',
          tailwindcss: '^4.0.0',
          typescript: '^5.7.0',
          vite: '^6.0.0',
          'vite-plugin-singlefile': '^2.1.0',
        },
      },
      null,
      2
    )
  );

  zip.file(
    'vercel.json',
    JSON.stringify(
      {
        framework: 'vite',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        rewrites: [{ source: '/(.*)', destination: '/index.html' }],
      },
      null,
      2
    )
  );

  zip.file(
    'vite.config.ts',
    `import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
`
  );

  zip.file(
    'index.html',
    `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PixelShift Pro — Free In-Browser Image Compressor & Converter</title>
    <meta name="description" content="100% private, free in-browser image compressor and file converter. Zero server uploads." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  );

  // Generate ZIP file and trigger download in browser
  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'pixelshift-pro-ready-for-vercel.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

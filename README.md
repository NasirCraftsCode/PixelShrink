# ⚡ PixelShift Pro — In-Browser Image Compressor & File Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![100% Client-Side Privacy](https://img.shields.io/badge/Privacy-100%25%20In--Browser-10b981)](https://github.com/)

> **PixelShift Pro** is a fast, 100% private, client-side web application for compressing and converting image files directly inside your browser. No server uploads, zero data tracking, and no file size limitations.

---

## 🌟 Key Features

- 🔒 **100% Private & In-Browser**: All compression and conversions happen locally using the HTML5 Canvas 2D engine and Web Workers. Your images never leave your device.
- 🔀 **Multi-Format Conversion**: Seamlessly convert between **WebP**, **JPEG/JPG**, **PNG**, **AVIF**, **BMP**, and **ICO (Favicon)**.
- 🎯 **Smart Target-Size Limit Solver**: Specify an exact maximum file size (e.g. `< 150 KB` or `< 300 KB`), and the solver performs an intelligent iterative search to optimize quality below the threshold.
- 🔬 **Interactive Split Loupe & Zoom Inspector**: Compare original vs compressed image fidelity in real-time with a draggable side-by-side slider and 1x/2x/4x magnification.
- 📦 **Batch Studio & 1-Click ZIP Download**: Process dozens of images simultaneously and download them packaged in a single zipped archive with celebration effects.
- 🌐 **Favicon & App Icon Studio**: Generate multi-resolution `.ico` binaries and preview simulated browser tabs and iOS home screen icons with copyable `<link>` HTML snippets.
- 📋 **Clipboard Paste & Sample Images**: Paste directly from the clipboard (`Ctrl+V` / `Cmd+V`) or test right away using built-in high-res photo and vector samples.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Batch Archiving**: [JSZip](https://stuk.github.io/jszip/)
- **Celebration Effects**: [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) installed on your machine.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pixelshift-pro.git

# Navigate into the project folder
cd pixelshift-pro

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📦 Production Build & Deployment

Build the optimized static bundle:

```bash
npm run build
```

The production-ready assets will be located in the `dist/` directory.

### Deploying for Free

Because this project is 100% static and client-side, you can host it for free on any platform:

| Platform | Deployment Method |
| :--- | :--- |
| **Vercel** | Connect your GitHub repo at [vercel.com](https://vercel.com). Set build command to `npm run build` and output directory to `dist`. |
| **Netlify** | Drag-and-drop the `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop) or connect your repository. |
| **GitHub Pages** | Go to **Repo Settings > Pages** and set source to **GitHub Actions** (Static HTML). |
| **Cloudflare Pages** | Connect your Git repository in the Cloudflare Dashboard under **Workers & Pages**. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

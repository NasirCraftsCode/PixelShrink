import React, { useState } from 'react';
import { X, Globe, Share2, Copy, Check, Rocket, Server, Code2 } from 'lucide-react';
import { downloadProjectSourceZip } from '../utils/projectSourceExporter';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'vercel' | 'netlify' | 'github' | 'cloudflare'>('vercel');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pixelshift-pro.web.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Public Deployment &amp; Sharing Guide
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                100% Free Hosting
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Because PixelShift Pro is 100% client-side (no backend or database required), it can be deployed publicly in seconds.
            </p>
          </div>
        </div>

        {/* Download Project Source & Quick Share Link Row */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[11px] text-slate-400 block font-medium">Download Source Code for GitHub / Vercel:</span>
              <span className="text-xs font-mono text-emerald-400 truncate block">Ready-to-deploy zip (package.json at root)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => downloadProjectSourceZip()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all shrink-0"
            >
              <Rocket className="w-3.5 h-3.5" />
              Download Project (.ZIP)
            </button>

            <button
              onClick={handleCopyUrl}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all shrink-0"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Free Deployment Platform Tabs */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deploy to Free Hosting in 3 Easy Steps:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedPlatform('vercel')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedPlatform === 'vercel'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4 text-indigo-400" /> Vercel
            </button>

            <button
              onClick={() => setSelectedPlatform('netlify')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedPlatform === 'netlify'
                  ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" /> Netlify
            </button>

            <button
              onClick={() => setSelectedPlatform('github')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedPlatform === 'github'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-purple-400" /> GitHub Pages
            </button>

            <button
              onClick={() => setSelectedPlatform('cloudflare')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedPlatform === 'cloudflare'
                  ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-4 h-4 text-amber-400" /> Cloudflare
            </button>
          </div>

          {/* Platform Specific Step Instructions */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs space-y-2.5">
            {selectedPlatform === 'vercel' && (
              <>
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Rocket className="w-4 h-4" /> Option 1: Deploy on Vercel (Recommended — Free &amp; Instant SSL)
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>Push this repository or upload code to your GitHub / GitLab account.</li>
                  <li>Go to <strong>vercel.com</strong> and click <strong>"Add New Project"</strong>.</li>
                  <li>Select your repo; Vercel automatically detects Vite and sets the build command to <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono">npm run build</code> and output folder to <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono">dist</code>.</li>
                  <li>Click <strong>Deploy</strong> and your public URL (e.g. <code className="text-emerald-300 font-mono">your-app.vercel.app</code>) goes live immediately!</li>
                </ol>
              </>
            )}

            {selectedPlatform === 'netlify' && (
              <>
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Option 2: Deploy on Netlify (Drag &amp; Drop or Git)
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>Run <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">npm run build</code> to produce the production <code className="font-mono text-cyan-300">dist/</code> folder.</li>
                  <li>Log into <strong>netlify.com</strong> and drag the <code className="font-mono text-cyan-300">dist/</code> folder into the Netlify Drop dashboard.</li>
                  <li>Your custom or free <code className="text-cyan-300 font-mono">.netlify.app</code> domain is live with automatic global CDN and HTTPS!</li>
                </ol>
              </>
            )}

            {selectedPlatform === 'github' && (
              <>
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> Option 3: Deploy on GitHub Pages
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>In your GitHub Repository, navigate to <strong>Settings &gt; Pages</strong>.</li>
                  <li>Set the build source to <strong>GitHub Actions</strong> (Static HTML).</li>
                  <li>Your site is automatically built and served at <code className="text-purple-300 font-mono">username.github.io/repo-name</code>.</li>
                </ol>
              </>
            )}

            {selectedPlatform === 'cloudflare' && (
              <>
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Server className="w-4 h-4" /> Option 4: Cloudflare Pages
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                  <li>Log into Cloudflare Dashboard and select <strong>Workers &amp; Pages</strong>.</li>
                  <li>Connect your git repo, set framework preset to <strong>Vite</strong>, and click <strong>Save and Deploy</strong>.</li>
                </ol>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">Zero database setup required • 100% Client-Side</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

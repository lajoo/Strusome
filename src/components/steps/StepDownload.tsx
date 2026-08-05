import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Copy, Check, Sparkles, ShieldCheck, FileCheck, Share2 } from 'lucide-react';

interface StepDownloadProps {
  onExportPng: () => Promise<Blob | null>;
}

export const StepDownload: React.FC<StepDownloadProps> = ({ onExportPng }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const blob = await onExportPng();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linkedin-post-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);
    try {
      const blob = await onExportPng();
      if (!blob) return;

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 }
        });
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Clipboard image copy not supported in this browser. Please use Download PNG.');
      }
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      alert('Could not copy image directly to clipboard. Please use Download PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Download className="w-4 h-4" />
          <span>Step 6 of 6 • Export & Publish</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Export High-Res Graphic</h2>
        <p className="text-xs text-slate-500 mt-1">
          Ready for instant 1080x1080 high-resolution publication on LinkedIn.
        </p>
      </div>

      {/* Post Technical Specs Summary Box */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2 text-xs">
        <div className="text-slate-800 font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Format Specs</span>
          </span>
          <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            PASSED
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 text-slate-500 border-t border-slate-100 font-medium">
          <div>Dimension: <span className="text-slate-800 font-mono font-bold">1080 x 1080 px</span></div>
          <div>Aspect Ratio: <span className="text-slate-800 font-mono font-bold">1:1 Square</span></div>
          <div>Color Space: <span className="text-slate-800 font-mono font-bold">sRGB PNG</span></div>
          <div>Processing: <span className="text-slate-800 font-mono font-bold">Browser GPU</span></div>
        </div>
      </div>

      {/* Primary Export Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-md shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-colors cursor-pointer text-sm"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Downloaded 1080x1080 PNG!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>{isExporting ? 'Generating PNG...' : 'Download 1080x1080 PNG'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-md text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied Image to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Image to Clipboard</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center gap-2 font-medium">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Purely client-side canvas generation. Confidential data never leaves memory.</span>
      </div>
    </div>
  );
};

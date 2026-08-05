import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { PostState, TemplateConfig, BackgroundItem, LibraryImage, StepId } from '../types';
import { renderPostToCanvas } from '../utils/canvasRenderer';
import { Eye, ShieldAlert, Sparkles, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

interface CanvasPreviewProps {
  state: PostState;
  template: TemplateConfig;
  background?: BackgroundItem;
  libraryImage?: LibraryImage;
  secondaryImage?: LibraryImage;
  onSelectStep: (stepId: StepId) => void;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
}

export interface CanvasPreviewHandle {
  exportBlob: () => Promise<Blob | null>;
  getCanvas: () => HTMLCanvasElement | null;
}

export const CanvasPreview = forwardRef<CanvasPreviewHandle, CanvasPreviewProps>(({
  state,
  template,
  background,
  libraryImage,
  secondaryImage,
  onSelectStep,
  onUpdateState
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgImgEl, setBgImgEl] = useState<HTMLImageElement | null>(null);
  const [slotImgEl, setSlotImgEl] = useState<HTMLImageElement | null>(null);
  const [secSlotImgEl, setSecSlotImgEl] = useState<HTMLImageElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.55); // Default fit zoom for typical desktop screen

  // Load Background image element
  useEffect(() => {
    if (!background?.url) {
      setBgImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = background.url;
    img.onload = () => setBgImgEl(img);
  }, [background?.url]);

  // Load Main Slot image element
  useEffect(() => {
    if (!libraryImage?.url) {
      setSlotImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = libraryImage.url;
    img.onload = () => setSlotImgEl(img);
  }, [libraryImage?.url]);

  // Load Secondary Slot image element (if applicable)
  useEffect(() => {
    if (!secondaryImage?.url) {
      setSecSlotImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = secondaryImage.url;
    img.onload = () => setSecSlotImgEl(img);
  }, [secondaryImage?.url]);

  // Render trigger whenever relevant props/state/images change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPostToCanvas(
      canvas,
      state,
      template,
      background,
      libraryImage,
      bgImgEl,
      slotImgEl,
      secSlotImgEl,
      { isExport: false }
    );
  }, [state, template, background, libraryImage, secondaryImage, bgImgEl, slotImgEl, secSlotImgEl]);

  // Expose export handles
  useImperativeHandle(ref, () => ({
    exportBlob: () => {
      return new Promise<Blob | null>((resolve) => {
        const offscreenCanvas = document.createElement('canvas');
        renderPostToCanvas(
          offscreenCanvas,
          state,
          template,
          background,
          libraryImage,
          bgImgEl,
          slotImgEl,
          secSlotImgEl,
          { isExport: true }
        );
        offscreenCanvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    },
    getCanvas: () => canvasRef.current
  }));

  // Handle direct click on canvas regions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scale = 1080 / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;

    const slot = template.imageSlot;
    const hl = template.headlineZone;
    const sub = template.subtitleZone;

    // Check click inside Image slot
    if (x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height) {
      onSelectStep('image');
      return;
    }

    // Check click inside Headline zone
    if (x >= hl.x && x <= hl.x + hl.width && y >= hl.y && y <= hl.y + 200) {
      onSelectStep('headline');
      return;
    }

    // Check click inside Subtitle zone
    if (x >= sub.x && x <= sub.x + sub.width && y >= sub.y && y <= sub.y + 100) {
      onSelectStep('subtitle');
      return;
    }

    // Otherwise click background
    onSelectStep('background');
  };

  return (
    <div className="flex-1 bg-slate-200 flex flex-col h-screen overflow-hidden font-sans relative">
      {/* Top Header Toolbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
        <div className="flex items-center text-sm text-slate-800">
          <span className="text-slate-400 font-medium">Projects</span>
          <svg className="w-4 h-4 mx-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-bold text-slate-800">LinkedIn_Post_Graphic.png</span>
        </div>

        {/* Controls: Safe Area, Watermark, Dimensions */}
        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">1080 x 1080 px</span>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <button
            onClick={() => onUpdateState(s => ({ ...s, showSafeArea: !s.showSafeArea }))}
            className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
              state.showSafeArea
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle safe area margin guides"
          >
            <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
            <span>Safe Area</span>
          </button>

          <button
            onClick={() => onUpdateState(s => ({ ...s, showBrandWatermark: !s.showBrandWatermark }))}
            className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
              state.showBrandWatermark
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle brand watermark badge"
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            <span>Watermark</span>
          </button>

          <button
            onClick={() => onUpdateState(s => ({ ...s, imageScale: 1.0, imagePanX: 0, imagePanY: 0 }))}
            className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset Fits
          </button>
        </div>
      </header>

      {/* Main Canvas Area (Canvas Mock Viewport) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-200 overflow-hidden relative">
        {/* Radial Grid Pattern Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* The Canvas Card */}
        <div className="bg-white shadow-2xl relative flex flex-col z-10 rounded-sm border border-slate-300 overflow-hidden group">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              width: `${1080 * zoomLevel}px`,
              height: `${1080 * zoomLevel}px`,
              cursor: 'pointer'
            }}
            className="block transition-all duration-150"
          />

          {/* Safe Area Watermark Overlay Line if toggled */}
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all pointer-events-none flex items-start justify-end p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 shadow-md px-2.5 py-1 rounded border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Click elements to edit
            </span>
          </div>
        </div>

        {/* Floating Zoom & Fit Screen Controls */}
        <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
          <div className="bg-white/90 backdrop-blur p-1.5 rounded-md shadow-lg flex items-center space-x-3 border border-white text-slate-600">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.35, z - 0.1))}
                className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold cursor-pointer text-xs"
              >
                -
              </button>
              <span className="text-xs font-bold text-slate-700 px-2 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.0, z + 0.1))}
                className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold cursor-pointer text-xs"
              >
                +
              </button>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <button
              onClick={() => setZoomLevel(0.55)}
              className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer px-1"
            >
              Fit Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

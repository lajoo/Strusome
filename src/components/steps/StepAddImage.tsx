import React, { useRef, useState } from 'react';
import { PostState, TemplateConfig } from '../../types';
import { User, Upload, Trash2, ZoomIn, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface StepAddImageProps {
  state: PostState;
  template: TemplateConfig;
  uploadedImage: { file: File; url: string; name: string } | null;
  onUploadImage: (file: File) => void;
  onRemoveImage: () => void;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

export const StepAddImage: React.FC<StepAddImageProps> = ({
  state,
  template,
  uploadedImage,
  onUploadImage,
  onRemoveImage,
  onUpdateState,
  onNextStep
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        onUploadImage(file);
      }
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        onUploadImage(file);
      }
    }
  };

  return (
    <div className="space-y-5 rounded-xl p-1 transition-all">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Step 4 of 7 • Select Image</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Image Asset</h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload an image (JPG, PNG, or WebP) for this post.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Upload Custom Image Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-600 bg-blue-50/80 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
        }`}
      >
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Upload className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-slate-800 block mb-1">
          Click to upload or drag & drop
        </span>
        <span className="text-[11px] text-slate-500 block">
          Supports JPG, PNG, or WebP
        </span>
      </div>

      {/* Selected Image Status & Controls */}
      {uploadedImage ? (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={uploadedImage.url}
                alt={uploadedImage.name}
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate" title={uploadedImage.name}>
                  {uploadedImage.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Image Loaded
                </span>
              </div>
            </div>
            <button
              onClick={onRemoveImage}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-blue-600" /> Image Fit & Position
              </span>
              <button
                onClick={() => onUpdateState(s => ({ ...s, imageScale: 1.0, imagePanX: 0, imagePanY: 0 }))}
                className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                <span>Zoom Scale</span>
                <span className="font-mono text-slate-800 font-bold">{Math.round(state.imageScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={state.imageScale}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateState(s => ({ ...s, imageScale: val }));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Pan Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] font-medium text-slate-500 block mb-1">Horizontal Position</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={state.imagePanX}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateState(s => ({ ...s, imagePanX: val }));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-500 block mb-1">Vertical Position</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={state.imagePanY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateState(s => ({ ...s, imagePanY: val }));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-300" />
          <span>No image selected</span>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue to Headline</span>
        </button>
      </div>
    </div>
  );
};

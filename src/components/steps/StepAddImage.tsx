import React, { useRef, useState } from 'react';
import { PostState, TemplateConfig } from '../../types';
import { User, Upload, Trash2, ZoomIn, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface StepAddImageProps {
  state: PostState;
  template: TemplateConfig;
  uploadedImage?: { file: File; url: string; name: string } | null;
  uploadedImage1?: { file: File; url: string; name: string } | null;
  uploadedImage2?: { file: File; url: string; name: string } | null;
  onUploadImage?: (file: File) => void;
  onUploadImage1?: (file: File) => void;
  onUploadImage2?: (file: File) => void;
  onRemoveImage?: () => void;
  onRemoveImage1?: () => void;
  onRemoveImage2?: () => void;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

export const StepAddImage: React.FC<StepAddImageProps> = ({
  state,
  template,
  uploadedImage,
  uploadedImage1,
  uploadedImage2,
  onUploadImage,
  onUploadImage1,
  onUploadImage2,
  onRemoveImage,
  onRemoveImage1,
  onRemoveImage2,
  onUpdateState,
  onNextStep
}) => {
  const isDualMode = Boolean(template.secondaryImageSlot);

  const img1 = uploadedImage1 !== undefined ? uploadedImage1 : (uploadedImage || null);
  const img2 = uploadedImage2 || null;

  const handleUpload1 = onUploadImage1 || onUploadImage || (() => {});
  const handleRemove1 = onRemoveImage1 || onRemoveImage || (() => {});
  const handleUpload2 = onUploadImage2 || (() => {});
  const handleRemove2 = onRemoveImage2 || (() => {});

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        handleUpload1(file);
      }
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        handleUpload2(file);
      }
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  // Drag & drop handlers for Image 1
  const handleDragOver1 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging1(true);
  };
  const handleDragLeave1 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging1(false);
  };
  const handleDrop1 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging1(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        handleUpload1(file);
      }
    }
  };

  // Drag & drop handlers for Image 2
  const handleDragOver2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging2(true);
  };
  const handleDragLeave2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging2(false);
  };
  const handleDrop2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging2(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match(/^image\/(jpeg|png|webp)$/)) {
        handleUpload2(file);
      }
    }
  };

  // Current values for Image 1
  const img1Scale = state.image1Scale ?? state.imageScale ?? 1.0;
  const img1PanX = state.image1PanX ?? state.imagePanX ?? 0;
  const img1PanY = state.image1PanY ?? state.imagePanY ?? 0;

  // Current values for Image 2
  const img2Scale = state.image2Scale ?? 1.0;
  const img2PanX = state.image2PanX ?? 0;
  const img2PanY = state.image2PanY ?? 0;

  return (
    <div className="space-y-5 rounded-xl p-1 transition-all">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Step 4 of 7 • Select {isDualMode ? 'Images' : 'Image'}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          {isDualMode ? 'Image Assets' : 'Image Asset'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isDualMode
            ? 'Upload two images (JPG, PNG, or WebP) for this post.'
            : 'Upload an image (JPG, PNG, or WebP) for this post.'}
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef1}
        onChange={handleFileChange1}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      {isDualMode && (
        <input
          type="file"
          ref={fileInputRef2}
          onChange={handleFileChange2}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      )}

      {/* Single Mode (Template 1) */}
      {!isDualMode && (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef1.current?.click()}
            onDragOver={handleDragOver1}
            onDragLeave={handleDragLeave1}
            onDrop={handleDrop1}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging1
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

          {img1 ? (
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={img1.url}
                    alt={img1.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate" title={img1.name}>
                      {img1.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Image Loaded
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRemove1}
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
                    onClick={() =>
                      onUpdateState((s) => ({
                        ...s,
                        image1Scale: 1.0,
                        image1PanX: 0,
                        image1PanY: 0,
                        imageScale: 1.0,
                        imagePanX: 0,
                        imagePanY: 0
                      }))
                    }
                    className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                    <span>Zoom Scale</span>
                    <span className="font-mono text-slate-800 font-bold">{Math.round(img1Scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={img1Scale}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateState((s) => ({
                        ...s,
                        image1Scale: val,
                        imageScale: val
                      }));
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block mb-1">Horizontal Position</span>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="5"
                      value={img1PanX}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onUpdateState((s) => ({
                          ...s,
                          image1PanX: val,
                          imagePanX: val
                        }));
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
                      value={img1PanY}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onUpdateState((s) => ({
                          ...s,
                          image1PanY: val,
                          imagePanY: val
                        }));
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
        </div>
      )}

      {/* Dual Mode (Template 2) */}
      {isDualMode && (
        <div className="space-y-5">
          {/* Panel 1: Image 1 (Left) */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                Image 1 (Left)
              </span>
              {img1 && (
                <button
                  onClick={handleRemove1}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {img1 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={img1.url}
                    alt={img1.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate" title={img1.name}>
                      {img1.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Image Loaded
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-blue-600" /> Controls (Left Image)
                    </span>
                    <button
                      onClick={() =>
                        onUpdateState((s) => ({
                          ...s,
                          image1Scale: 1.0,
                          image1PanX: 0,
                          image1PanY: 0,
                          imageScale: 1.0,
                          imagePanX: 0,
                          imagePanY: 0
                        }))
                      }
                      className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                      <span>Zoom Scale</span>
                      <span className="font-mono text-slate-800 font-bold">{Math.round(img1Scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={img1Scale}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateState((s) => ({
                          ...s,
                          image1Scale: val,
                          imageScale: val
                        }));
                      }}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 block mb-1">Horizontal Position</span>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={img1PanX}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          onUpdateState((s) => ({
                            ...s,
                            image1PanX: val,
                            imagePanX: val
                          }));
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
                        value={img1PanY}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          onUpdateState((s) => ({
                            ...s,
                            image1PanY: val,
                            imagePanY: val
                          }));
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef1.current?.click()}
                onDragOver={handleDragOver1}
                onDragLeave={handleDragLeave1}
                onDrop={handleDrop1}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                  isDragging1
                    ? 'border-blue-600 bg-blue-50/80'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">
                  Upload Left Image
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Click or drag & drop (JPG, PNG, WebP)
                </span>
              </div>
            )}
          </div>

          {/* Panel 2: Image 2 (Right) */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                Image 2 (Right)
              </span>
              {img2 && (
                <button
                  onClick={handleRemove2}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {img2 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={img2.url}
                    alt={img2.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate" title={img2.name}>
                      {img2.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Image Loaded
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-blue-600" /> Controls (Right Image)
                    </span>
                    <button
                      onClick={() =>
                        onUpdateState((s) => ({
                          ...s,
                          image2Scale: 1.0,
                          image2PanX: 0,
                          image2PanY: 0
                        }))
                      }
                      className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                      <span>Zoom Scale</span>
                      <span className="font-mono text-slate-800 font-bold">{Math.round(img2Scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={img2Scale}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateState((s) => ({
                          ...s,
                          image2Scale: val
                        }));
                      }}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 block mb-1">Horizontal Position</span>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={img2PanX}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          onUpdateState((s) => ({
                            ...s,
                            image2PanX: val
                          }));
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
                        value={img2PanY}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          onUpdateState((s) => ({
                            ...s,
                            image2PanY: val
                          }));
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef2.current?.click()}
                onDragOver={handleDragOver2}
                onDragLeave={handleDragLeave2}
                onDrop={handleDrop2}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                  isDragging2
                    ? 'border-blue-600 bg-blue-50/80'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">
                  Upload Right Image
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Click or drag & drop (JPG, PNG, WebP)
                </span>
              </div>
            )}
          </div>
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

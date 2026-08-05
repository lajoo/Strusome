import React, { useState, useRef } from 'react';
import { PostState, TemplateConfig, LibraryImage } from '../../types';
import { LIBRARY_IMAGES } from '../../data/images';
import { User, Check, ZoomIn, RotateCcw, Image as ImageIcon, Upload } from 'lucide-react';

interface StepAddImageProps {
  state: PostState;
  template: TemplateConfig;
  customImages?: LibraryImage[];
  onAddCustomImage?: (newImg: LibraryImage) => void;
  onSelectImage: (imageId: string) => void;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

const IMAGE_CATEGORIES = ['All', '3D FEA Models', 'Frame & Beam', 'Precast Concrete', 'Uploaded'] as const;

export const StepAddImage: React.FC<StepAddImageProps> = ({
  state,
  template,
  customImages = [],
  onAddCustomImage,
  onSelectImage,
  onUpdateState,
  onNextStep
}) => {
  const [category, setCategory] = useState<string>('All');
  const [activeSlotTarget, setActiveSlotTarget] = useState<'main' | 'secondary'>('main');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allImages = [...customImages, ...LIBRARY_IMAGES];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const resultUrl = event.target?.result as string;
        if (!resultUrl) return;

        const cleanName = file.name.replace(/\.[^/.]+$/, '');

        // Post exact pixel data to server
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, dataUrl: resultUrl })
          });
          const data = await res.json();
          if (data.success && data.item) {
            if (onAddCustomImage) {
              onAddCustomImage(data.item);
            }
            handleImageClick(data.item.id);
            return;
          }
        } catch (err) {
          console.error('Failed to post image to server, falling back to local state:', err);
        }

        const newImg: LibraryImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: cleanName,
          category: 'Uploaded',
          url: resultUrl,
          tagline: cleanName
        };

        if (onAddCustomImage) {
          onAddCustomImage(newImg);
        }
        handleImageClick(newImg.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const filteredImages = allImages.filter((img) => {
    if (category === 'Uploaded') {
      return customImages.some((ci) => ci.id === img.id);
    }
    return category === 'All' || img.category === category;
  });

  const selectedMainImage = allImages.find((i) => i.id === state.selectedImageId);

  const handleImageClick = (imageId: string) => {
    if (activeSlotTarget === 'secondary' && template.secondaryImageSlot) {
      onUpdateState((s) => ({ ...s, secondaryImageId: imageId }));
    } else {
      onSelectImage(imageId);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-5 rounded-xl p-1 transition-all ${
        isDragging ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
      }`}
    >
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Step 3 of 6 • Photo Asset</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Feature Photo</h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload your own photo or image asset for this post.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-3 bg-blue-50/70 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 underline cursor-pointer"
            >
              Upload Custom Images
            </button>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Drag & drop or click to upload (saved permanently to local storage)
            </p>
          </div>
        </div>
      </div>

      {/* Dual Slot Toggle if template supports two slots */}
      {template.secondaryImageSlot && (
        <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg flex gap-2">
          <button
            onClick={() => setActiveSlotTarget('main')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all cursor-pointer ${
              activeSlotTarget === 'main'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-blue-700 hover:bg-blue-100/50'
            }`}
          >
            + Main Image
          </button>
          <button
            onClick={() => setActiveSlotTarget('secondary')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all cursor-pointer ${
              activeSlotTarget === 'secondary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-blue-700 hover:bg-blue-100/50'
            }`}
          >
            + Image (Side)
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      {allImages.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {IMAGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat} {cat === 'Uploaded' && customImages.length > 0 ? `(${customImages.length})` : ''}
            </button>
          ))}
        </div>
      )}

      {/* Grid Thumbnail Picker */}
      {filteredImages.length === 0 ? (
        <div className="p-6 text-center border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-xs">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-600">No uploaded images yet</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Click "Upload Custom Images" above or drop your photo here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredImages.map((img) => {
            const isSelected = activeSlotTarget === 'secondary'
              ? state.secondaryImageId === img.id
              : state.selectedImageId === img.id;

            return (
              <button
                key={img.id}
                onClick={() => handleImageClick(img.id)}
                className={`p-2.5 rounded-lg border-2 text-left transition-all relative group cursor-pointer bg-white shadow-sm ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-square rounded overflow-hidden bg-slate-100 relative border border-slate-100">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-800 truncate" title={img.name}>{img.name}</div>
                  {img.tagline && (
                    <div className="text-[10px] text-slate-400 truncate mt-0.5" title={img.tagline}>{img.tagline}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Adjustments: Scale & Pan Controls */}
      {selectedMainImage && (
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
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
              <span className="text-[10px] font-medium text-slate-500 block mb-1">Pan Horizontal</span>
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
              <span className="text-[10px] font-medium text-slate-500 block mb-1">Pan Vertical</span>
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
      )}

      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
        >
          Next Step: Edit Headline →
        </button>
      </div>
    </div>
  );
};



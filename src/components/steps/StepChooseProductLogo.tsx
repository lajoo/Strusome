import React, { useState } from 'react';
import { PostState } from '../../types';
import { PRODUCT_LOGOS, ProductLogo } from '../../data/productLogos';
import { Box, Check, Search, AlertCircle } from 'lucide-react';

interface StepChooseProductLogoProps {
  state: PostState;
  onSelectProductLogo: (logo: ProductLogo) => void;
  onNextStep: () => void;
}

export const StepChooseProductLogo: React.FC<StepChooseProductLogoProps> = ({
  state,
  onSelectProductLogo,
  onNextStep
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [failedLogoIds, setFailedLogoIds] = useState<Record<string, boolean>>({});

  const filteredLogos = PRODUCT_LOGOS.filter((logo) => {
    return (
      searchQuery === '' ||
      logo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleImageError = (id: string) => {
    setFailedLogoIds((prev) => ({ ...prev, [id]: true }));
  };

  const isSelectedLogo = (logo: ProductLogo) => {
    return state.selectedProductLogo?.id === logo.id;
  };

  const canContinue = Boolean(state.selectedProductLogo);

  return (
    <div className="space-y-5 rounded-xl p-1 font-sans">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Box className="w-4 h-4" />
          <span>Step 2 of 7 • Product Logo</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Choose Product Logo</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select a product logo asset from the library to display on your post.
        </p>
      </div>

      {/* Search Bar */}
      {PRODUCT_LOGOS.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logos..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
          />
        </div>
      )}

      {/* Grid Thumbnail Picker */}
      {filteredLogos.length === 0 ? (
        <div className="p-6 text-center border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-xs">
          <p className="font-medium text-slate-600">No logo assets available</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Place logo files in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">/public/product-logos/</code> and register them in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">src/data/productLogos.ts</code>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredLogos.map((logo) => {
            const isSelected = isSelectedLogo(logo);
            const isFailed = failedLogoIds[logo.id];

            return (
              <button
                key={logo.id}
                disabled={isFailed}
                onClick={() => !isFailed && onSelectProductLogo(logo)}
                className={`p-2 rounded-lg border-2 text-left transition-all relative group bg-white shadow-sm ${
                  isFailed ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                } ${
                  isSelected && !isFailed
                    ? 'border-blue-600 ring-4 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-square rounded overflow-hidden relative border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                  {isFailed ? (
                    <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400 gap-1">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] font-medium text-slate-500">Missing logo asset</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={logo.src}
                        alt={logo.name}
                        onError={() => handleImageError(logo.id)}
                        className="w-full h-full object-contain transition-transform group-hover:scale-105"
                      />

                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-800 truncate" title={logo.name}>
                    {logo.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        <button
          disabled={!canContinue}
          onClick={onNextStep}
          className={`w-full py-3 rounded-md font-bold text-sm transition-all ${
            canContinue
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/20 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next Step: Choose Background →
        </button>
        {!canContinue && (
          <p className="text-[11px] text-amber-600 font-medium text-center mt-2">
            Please select a product logo to continue.
          </p>
        )}
      </div>
    </div>
  );
};

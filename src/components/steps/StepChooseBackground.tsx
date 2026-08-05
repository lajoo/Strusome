import React, { useState, useEffect } from 'react';
import { PostState, BackgroundItem } from '../../types';
import { BACKGROUNDS } from '../../data/backgrounds';
import { storage } from '../../lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Image as ImageIcon, Check, Search, AlertCircle } from 'lucide-react';

interface StepChooseBackgroundProps {
  state: PostState;
  onSelectBackground: (bgId: string) => void;
  onNextStep: () => void;
}

interface LoadedItem extends BackgroundItem {
  resolvedUrl?: string;
  status: 'loading' | 'loaded' | 'missing';
}

export const StepChooseBackground: React.FC<StepChooseBackgroundProps> = ({
  state,
  onSelectBackground,
  onNextStep
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<LoadedItem[]>(() =>
    BACKGROUNDS.map((bg) => ({ ...bg, status: 'loading' }))
  );

  useEffect(() => {
    let isMounted = true;

    const fetchStorageUrls = async () => {
      const results = await Promise.all(
        BACKGROUNDS.map(async (item): Promise<LoadedItem> => {
          if (item.url && item.url.length > 0) {
            return {
              ...item,
              resolvedUrl: item.url,
              status: 'loaded'
            };
          }
          if (!item.storagePath) {
            return { ...item, status: 'missing' };
          }
          try {
            const storageRef = ref(storage, item.storagePath);
            const downloadUrl = await getDownloadURL(storageRef);
            return {
              ...item,
              resolvedUrl: downloadUrl,
              url: downloadUrl,
              status: 'loaded'
            };
          } catch (error) {
            // File missing or not uploaded to Firebase Storage yet
            return {
              ...item,
              status: 'missing'
            };
          }
        })
      );

      if (isMounted) {
        setItems(results);
      }
    };

    fetchStorageUrls();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter((bg) => {
    return (
      searchQuery === '' ||
      bg.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 rounded-xl p-1 font-sans">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Step 2 of 6 • Backgrounds</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Select Background</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select an architectural background loaded directly from Firebase Storage.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search backgrounds..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
        />
      </div>

      {/* Grid Thumbnail Picker */}
      {filteredItems.length === 0 ? (
        <div className="p-6 text-center border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-xs">
          <p className="font-medium text-slate-600">No background assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredItems.map((bg) => {
            const isSelected = state.selectedBackgroundId === bg.id;

            return (
              <button
                key={bg.id}
                disabled={bg.status === 'missing' || bg.status === 'loading'}
                onClick={() => bg.resolvedUrl && onSelectBackground(bg.id)}
                className={`p-2 rounded-lg border-2 text-left transition-all relative group bg-white shadow-sm ${
                  bg.status === 'loaded' ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                } ${
                  isSelected && bg.status === 'loaded'
                    ? 'border-blue-600 ring-4 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-square rounded overflow-hidden relative border border-slate-100 bg-slate-100 flex items-center justify-center">
                  {bg.status === 'loading' && (
                    <div className="text-[11px] text-slate-400 font-medium animate-pulse">
                      Loading...
                    </div>
                  )}

                  {bg.status === 'missing' && (
                    <div className="flex flex-col items-center justify-center text-center p-3 text-slate-400 gap-1.5">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-[11px] font-medium text-slate-500">Missing asset</span>
                    </div>
                  )}

                  {bg.status === 'loaded' && bg.resolvedUrl && (
                    <>
                      <img
                        src={bg.resolvedUrl}
                        alt={bg.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
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
                  <div className="text-xs font-bold text-slate-800 truncate" title={bg.name}>
                    {bg.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
        >
          Next Step: Add Image →
        </button>
      </div>
    </div>
  );
};

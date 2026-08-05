import React, { useState } from 'react';
import { PostState } from '../../types';
import { BACKGROUNDS } from '../../data/backgrounds';
import { Image as ImageIcon, Check, Search } from 'lucide-react';

interface StepChooseBackgroundProps {
  state: PostState;
  onSelectBackground: (bgId: string) => void;
  onNextStep: () => void;
}

export const StepChooseBackground: React.FC<StepChooseBackgroundProps> = ({
  state,
  onSelectBackground,
  onNextStep
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = BACKGROUNDS.filter((background) =>
    background.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 rounded-xl p-1 font-sans">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Step 3 of 7 • Backgrounds</span>
        </div>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Select Background
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Choose one of the six available architectural backgrounds.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search backgrounds..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-6 text-center border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-xs">
          <p className="font-medium text-slate-600">
            No backgrounds found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredItems.map((background) => {
            const isSelected =
              state.selectedBackgroundId === background.id;

            return (
              <button
                key={background.id}
                type="button"
                onClick={() => onSelectBackground(background.id)}
                className={`p-2 rounded-lg border-2 text-left transition-all relative group bg-white shadow-sm cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-square rounded overflow-hidden relative border border-slate-100 bg-slate-100">
                  <img
                    src={background.url}
                    alt={background.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={() => {
                      console.error(
                        `Failed to load background: ${background.url}`
                      );
                    }}
                  />

                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <div
                    className="text-xs font-bold text-slate-800 truncate"
                    title={background.name}
                  >
                    {background.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
        >
          Next Step: Add Image →
        </button>
      </div>
    </div>
  );
};

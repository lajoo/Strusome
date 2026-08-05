import React from 'react';
import { PostState, TemplateConfig } from '../../types';
import { Type, AlertCircle } from 'lucide-react';

interface StepEditHeadlineProps {
  state: PostState;
  template: TemplateConfig;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

export const StepEditHeadline: React.FC<StepEditHeadlineProps> = ({
  state,
  template,
  onUpdateState,
  onNextStep
}) => {
  const zone = template.headlineZone;
  const currentLength = state.headlineText.length;
  const maxChars = zone.maxChars;
  const remainingChars = maxChars - currentLength;
  const isOverLimit = remainingChars < 0;

  const handleTextChange = (value: string) => {
    if (value.length <= maxChars + 15) {
      onUpdateState(s => ({ ...s, headlineText: value }));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Type className="w-4 h-4" />
          <span>Step 5 of 7 • Headline</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Post Headline</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enforced char limits to ensure perfect multi-line auto-fit rendering.
        </p>
      </div>

      {/* Main Text Area with Char Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">Headline Content</label>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              isOverLimit
                ? 'bg-red-50 text-red-600 border border-red-200'
                : remainingChars < 10
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {remainingChars} left (Max {maxChars})
          </span>
        </div>

        <textarea
          rows={4}
          value={state.headlineText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={zone.placeholder}
          className={`w-full p-3.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all leading-snug font-sans ${
            isOverLimit
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
          }`}
        />

        {isOverLimit && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Headline exceeds recommended character limit for this template.</span>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
        >
          Next Step: Edit Subtitle →
        </button>
      </div>
    </div>
  );
};

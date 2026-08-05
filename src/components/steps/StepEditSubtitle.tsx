import React from 'react';
import { PostState, TemplateConfig } from '../../types';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface StepEditSubtitleProps {
  state: PostState;
  template: TemplateConfig;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

export const StepEditSubtitle: React.FC<StepEditSubtitleProps> = ({
  state,
  template,
  onUpdateState,
  onNextStep
}) => {
  const zone = template.subtitleZone;
  const currentLength = state.subtitleText.length;
  const maxChars = zone.maxChars;
  const remainingChars = maxChars - currentLength;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Step 5 of 6 • Subtitle & Author</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Subtitle</h2>
        <p className="text-xs text-slate-500 mt-1">
          Author line, job title, or secondary corporate sign-off.
        </p>
      </div>

      {/* Subtitle Toggle Checkbox */}
      <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <input
          type="checkbox"
          id="include-subtitle-checkbox"
          checked={state.subtitleEnabled !== false}
          onChange={(e) => onUpdateState(s => ({ ...s, subtitleEnabled: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="include-subtitle-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
          Include subtitle
        </label>
      </div>

      {state.subtitleEnabled !== false ? (
        /* Main Text Input */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Subtitle Line</label>
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

          <input
            type="text"
            value={state.subtitleText}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= maxChars + 15) {
                onUpdateState(s => ({ ...s, subtitleText: val }));
              }
            }}
            placeholder={zone.placeholder}
            className={`w-full p-3 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-medium ${
              isOverLimit
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
            }`}
          />

          {isOverLimit && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Subtitle exceeds recommended length limit.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border border-dashed border-slate-200 bg-slate-50/50 rounded-lg text-center text-slate-500 text-xs font-medium">
          Subtitle disabled. Headline will expand to fill the combined area.
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
        >
          Next Step: Download →
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { PostState, TemplateConfig } from '../../types';
import { MessageSquare, AlertCircle, Users, ArrowRight } from 'lucide-react';

interface StepEditSubtitleProps {
  state: PostState;
  template: TemplateConfig;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

const AUTHOR_PRESETS = [
  'Sarah Chen • Chief Technology Officer',
  'Marcus Vance • Head of Product Experience',
  'Elena Rostova • Head of AI Research',
  'David K. • Founder & CEO @ Acme Inc.',
  'Acme Engineering Team • Building the Future'
];

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

      {/* Main Text Input */}
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

      {/* Author Presets */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Author Presets</span>
        </div>

        <div className="space-y-1.5">
          {AUTHOR_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateState(s => ({ ...s, subtitleText: preset }))}
              className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer truncate shadow-sm"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

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

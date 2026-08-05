import React from 'react';
import { PostState, TemplateConfig } from '../../types';
import { Type, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface StepEditHeadlineProps {
  state: PostState;
  template: TemplateConfig;
  onUpdateState: (updater: (prev: PostState) => PostState) => void;
  onNextStep: () => void;
}

const HEADLINE_SUGGESTIONS = [
  '5 Proven Strategies to Scale AI Engineering Teams in 2026',
  'How We Decreased Cloud Ingress Latency by 45% in 3 Weeks',
  'The Future of Product Design isn\'t UI — It\'s Workflow Intelligence',
  '3 Crucial Lessons from Scaling Our Platform to 10M Users',
  'Why Autonomous AI Agents Will Replace Monolithic Scripts'
];

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
          <span>Step 4 of 6 • Headline</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Post Headline</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enforced char limits to ensure perfect multi-line auto-fit rendering.
        </p>
      </div>

      {/* Product Logo Input if template defines productLogoZone */}
      {template.productLogoZone && (
        <div className="space-y-1.5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg">
          <label className="text-xs font-bold text-blue-900 block">
            + Product Logo Badge Name
          </label>
          <input
            type="text"
            value={state.productLogoText || ''}
            onChange={(e) => onUpdateState((s) => ({ ...s, productLogoText: e.target.value }))}
            placeholder="e.g. FEM-Design, WIN-Stat, IMD-3D"
            className="w-full p-2 bg-white border border-blue-300 rounded text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <p className="text-[10px] text-blue-700 font-medium">
            Renders inside the official outline pill on top of the layout (e.g. "+ {state.productLogoText || 'FEM-Design'}").
          </p>
        </div>
      )}

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

      {/* Color Preset Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Headline Text Color</label>
        <div className="flex items-center gap-2">
          {[
            { label: 'White', color: '#FFFFFF' },
            { label: 'Blue', color: '#38BDF8' },
            { label: 'Emerald', color: '#34D399' },
            { label: 'Amber', color: '#FCD34D' }
          ].map((item) => (
            <button
              key={item.color}
              onClick={() => onUpdateState(s => ({ ...s, textColorOverride: item.color }))}
              className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                (state.textColorOverride || zone.color) === item.color
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Team Starters */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Inspiration Starters</span>
        </div>

        <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {HEADLINE_SUGGESTIONS.map((hook, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateState(s => ({ ...s, headlineText: hook }))}
              className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer truncate shadow-sm"
            >
              "{hook}"
            </button>
          ))}
        </div>
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

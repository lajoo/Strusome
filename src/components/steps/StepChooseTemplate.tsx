import React from 'react';
import { TemplateConfig, PostState } from '../../types';
import { TEMPLATES } from '../../data/templates';
import { Layout, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

interface StepChooseTemplateProps {
  state: PostState;
  onSelectTemplate: (templateId: string) => void;
  onNextStep: () => void;
}

export const StepChooseTemplate: React.FC<StepChooseTemplateProps> = ({
  state,
  onSelectTemplate,
  onNextStep
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layout className="w-4 h-4" />
          <span>Step 1 of 6 • Select Wireframe Template</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Choose StruSoft Layout</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select a template wireframe. Each layout features official StruSoft top-right brand badge, product logo box, and customizable image slots.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = state.selectedTemplateId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`relative group cursor-pointer border-2 rounded-xl overflow-hidden bg-white shadow-sm p-4 transition-all ${
                isSelected
                  ? 'border-blue-600 ring-4 ring-blue-600/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Wireframe Miniature Preview Card */}
              <div className="mb-3 rounded-lg border border-slate-200 bg-white p-1 overflow-hidden flex items-center justify-center relative shadow-sm">
                {tmpl.layoutStyle === 'strusoft-single' && (
                  <img
                    src="/templates/template-1.svg"
                    alt="StruSoft Single Focus Wireframe"
                    className="w-full aspect-square object-contain rounded border border-slate-100"
                  />
                )}

                {tmpl.layoutStyle === 'strusoft-dual' && (
                  <img
                    src="/templates/template-2.svg"
                    alt="StruSoft Dual Feature Wireframe"
                    className="w-full aspect-square object-contain rounded border border-slate-100"
                  />
                )}

                {tmpl.layoutStyle === 'spotlight' && (
                  <div className="w-full aspect-square bg-slate-900 rounded p-2 flex items-center gap-2 border border-slate-700">
                    <div className="w-12 h-16 rounded bg-sky-500/20 border border-sky-400 text-sky-300 text-[8px] font-bold flex items-center justify-center">
                      Portrait
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-16 bg-sky-400 rounded" />
                      <div className="h-3 w-28 bg-white/80 rounded" />
                      <div className="h-2 w-20 bg-slate-400 rounded" />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">{tmpl.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {tmpl.tagline}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Next Step: Choose Background</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

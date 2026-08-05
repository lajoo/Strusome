import React from 'react';
import { StepId, StepInfo } from '../types';
import { Layout, Image as ImageIcon, User, Type, MessageSquare, Download, CheckCircle2, ChevronRight, BookOpen, LogOut } from 'lucide-react';

export const STEPS: StepInfo[] = [
  {
    id: 'template',
    number: 1,
    title: 'Choose Template',
    shortDesc: '1 of 3 predefined layouts',
    instruction: 'Select a layout structure (Spotlight, Quote, or Announcement).'
  },
  {
    id: 'background',
    number: 2,
    title: 'Choose Background',
    shortDesc: '20+ background library',
    instruction: 'Pick a high-res background from Gradients, Minimal, or Dark themes.'
  },
  {
    id: 'image',
    number: 3,
    title: 'Add Image',
    shortDesc: 'Pre-stored team photos',
    instruction: 'Select an executive portrait or stock visual from team library.'
  },
  {
    id: 'headline',
    number: 4,
    title: 'Edit Headline',
    shortDesc: 'Enforced char limits',
    instruction: 'Write a punchy headline post hook formatted to template specs.'
  },
  {
    id: 'subtitle',
    number: 5,
    title: 'Edit Subtitle',
    shortDesc: 'Author name & title',
    instruction: 'Add author name, company role, or secondary description.'
  },
  {
    id: 'download',
    number: 6,
    title: 'Download Post',
    shortDesc: '1080x1080 high-res PNG',
    instruction: 'Export instant high-resolution 1080x1080 graphic for LinkedIn.'
  }
];

interface SidebarStepperProps {
  currentStepId: StepId;
  onSelectStep: (stepId: StepId) => void;
  completedSteps: StepId[];
  onOpenAdminGuide: () => void;
  onLogout: () => void;
}

export const SidebarStepper: React.FC<SidebarStepperProps> = ({
  currentStepId,
  onSelectStep,
  completedSteps,
  onOpenAdminGuide,
  onLogout
}) => {
  const getStepIcon = (id: StepId) => {
    switch (id) {
      case 'template': return Layout;
      case 'background': return ImageIcon;
      case 'image': return User;
      case 'headline': return Type;
      case 'subtitle': return MessageSquare;
      case 'download': return Download;
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans z-20 select-none">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-800">LinkedIn Post</h1>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Creator Studio v1.0</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-500">
            Pro
          </span>
        </div>
      </div>

      {/* Stepper Steps List */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="px-6 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Workflow Steps
        </div>

        {STEPS.map((step) => {
          const Icon = getStepIcon(step.id);
          const isActive = currentStepId === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`px-6 py-3 transition-colors cursor-pointer group relative ${
                isActive
                  ? 'bg-blue-50/80 border-r-4 border-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold mr-3 shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : step.number}
                  </span>
                  <span
                    className={`font-semibold text-sm ${
                      isActive
                        ? 'text-blue-900'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </div>

              <p
                className={`text-xs mt-1 ml-9 ${
                  isActive ? 'text-blue-600 font-medium' : 'text-slate-500'
                }`}
              >
                {step.shortDesc}
              </p>

              {isActive && (
                <div className="mt-2 ml-9 text-[11px] text-blue-700/80 leading-snug bg-blue-100/50 p-2 rounded border border-blue-200/60">
                  {step.instruction}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Admin Guide & Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <button
          onClick={onOpenAdminGuide}
          className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center justify-between transition-all cursor-pointer shadow-sm"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Admin Asset Guide</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span>Lock Creator Studio</span>
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { X, FolderTree, FileCode, Server, Database, Check, Copy, BookOpen } from 'lucide-react';

interface AdminGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGuideModal: React.FC<AdminGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'folders' | 'templates' | 'backgrounds' | 'images'>('folders');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const folderStructureSnippet = `
firebase-storage-bucket/
├── templates/
│   ├── template-spotlight.json
│   ├── template-quote.json
│   └── template-announcement.json
├── backgrounds/
│   ├── bg-minimal-slate.svg
│   ├── bg-grad-midnight-aurora.svg
│   └── catalog.json   (optional manifest listing all background items)
└── images/
    ├── sarah-chen.png
    ├── marcus-vance.png
    └── catalog.json   (optional manifest listing all photo library items)
`;

  const templateJsonSnippet = `{
  "id": "template-custom-event",
  "name": "Global Webinar Announcement",
  "tagline": "Sleek banner for upcoming live events and podcasts",
  "description": "Top-aligned event image slot with dark backdrop and gold badge.",
  "category": "Events",
  "layoutStyle": "spotlight",
  "badgeText": "LIVE WEBINAR 🎙️",
  "accentColor": "#F59E0B",
  "defaultHeadline": "Join Us Live: Building AI Agents at Scale",
  "defaultSubtitle": "Thursday, Aug 12 • 10:00 AM PST",
  "thumbnailBg": "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
  "imageSlot": {
    "x": 80,
    "y": 180,
    "width": 420,
    "height": 640,
    "shape": "rounded-rect",
    "borderRadius": 24,
    "label": "Speaker Portrait",
    "borderWidth": 3,
    "borderColor": "#F59E0B"
  },
  "headlineZone": {
    "x": 540,
    "y": 280,
    "width": 460,
    "maxFontSize": 42,
    "minFontSize": 26,
    "maxChars": 90,
    "align": "left",
    "color": "#FFFFFF",
    "fontFamily": "system-ui, sans-serif",
    "fontWeight": "800",
    "lineHeight": 1.25,
    "placeholder": "Event title..."
  },
  "subtitleZone": {
    "x": 540,
    "y": 640,
    "width": 460,
    "maxFontSize": 22,
    "minFontSize": 16,
    "maxChars": 60,
    "align": "left",
    "color": "#FCD34D",
    "fontFamily": "system-ui, sans-serif",
    "fontWeight": "600",
    "lineHeight": 1.4,
    "placeholder": "Date & Time..."
  }
}`;

  const backgroundJsonSnippet = `{
  "id": "bg-custom-cyber-mesh",
  "name": "Cybernetic Mesh Blue",
  "category": "Tech & Modern",
  "url": "https://storage.googleapis.com/your-bucket/backgrounds/cyber-mesh.png",
  "tags": ["cyber", "blue", "grid", "tech"]
}`;

  const imageJsonSnippet = `{
  "id": "img-custom-alex-vp",
  "name": "Alex Riviera (VP Sales)",
  "category": "Execs & Team",
  "tagline": "VP Enterprise Sales",
  "url": "https://storage.googleapis.com/your-bucket/images/alex-riviera.png"
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Admin Asset Library Guide</h2>
              <p className="text-xs text-slate-500">How to add new templates, backgrounds, and images to your storage bucket</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-50/50 border-b border-slate-200 flex items-center gap-2">
          {[
            { id: 'folders', label: '1. Folder Structure', icon: FolderTree },
            { id: 'templates', label: '2. Template JSON', icon: FileCode },
            { id: 'backgrounds', label: '3. Background JSON', icon: Server },
            { id: 'images', label: '4. Image JSON', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 text-xs font-semibold rounded-t-lg flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? 'bg-white text-blue-600 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700 scrollbar-thin scrollbar-thumb-slate-200">
          {activeTab === 'folders' && (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed font-medium">
                To expand the LinkedIn Post Creator asset library in Firebase Storage or local static hosting, organize files under the following standardized cloud paths:
              </p>
              <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400">
                <button
                  onClick={() => copyCode(folderStructureSnippet, 'folders')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedTab === 'folders' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'folders' ? 'Copied' : 'Copy'}</span>
                </button>
                <pre>{folderStructureSnippet.trim()}</pre>
              </div>
              <p className="text-slate-500 text-[11px] font-medium">
                💡 <strong className="text-slate-800">Tip:</strong> When deploying to Firebase Hosting, you can serve these directly under <code className="text-blue-600">/public/templates/</code>, <code className="text-blue-600">/public/backgrounds/</code>, and <code className="text-blue-600">/public/images/</code> or load dynamically from Firebase Storage.
              </p>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed font-medium">
                Each template file specifies exact bounding boxes for image slots, headline zones, subtitle zones, and character caps in 1080x1080 canvas coordinates:
              </p>
              <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-300">
                <button
                  onClick={() => copyCode(templateJsonSnippet, 'templates')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedTab === 'templates' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'templates' ? 'Copied' : 'Copy'}</span>
                </button>
                <pre>{templateJsonSnippet.trim()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'backgrounds' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold">
                ⚠️ Admin Upload Notice: Please manually upload the six original JPG files into the <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">/backgrounds/</code> folder in Firebase Storage via the Firebase Console:
                <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-[11px] text-amber-900">
                  <li>backgrounds/Quality-Hotel.jpg</li>
                  <li>backgrounds/Axel-towers.jpg</li>
                  <li>backgrounds/Emporium.jpg</li>
                  <li>backgrounds/Kineum.jpg</li>
                  <li>backgrounds/Norra-Tornen.jpg</li>
                  <li>backgrounds/Paper-island.jpg</li>
                </ul>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Once uploaded, Step 2 will automatically retrieve download URLs for each exact asset using <code className="text-blue-600 font-mono">getDownloadURL()</code>.
              </p>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed font-medium">
                Add executive portraits or team photos under <code className="text-blue-600">/images/</code> and append to the library manifest:
              </p>
              <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300">
                <button
                  onClick={() => copyCode(imageJsonSnippet, 'images')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedTab === 'images' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'images' ? 'Copied' : 'Copy'}</span>
                </button>
                <pre>{imageJsonSnippet.trim()}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Internal Maintainer Guide • LinkedIn Post Creator
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

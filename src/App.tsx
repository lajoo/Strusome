import React, { useState, useEffect, useRef } from 'react';
import { StepId, PostState, BackgroundItem, LibraryImage } from './types';
import { TEMPLATES } from './data/templates';
import { BACKGROUNDS } from './data/backgrounds';
import { LIBRARY_IMAGES } from './data/images';

import { PasswordGate } from './components/PasswordGate';
import { SidebarStepper, STEPS } from './components/SidebarStepper';
import { CanvasPreview, CanvasPreviewHandle } from './components/CanvasPreview';

import { StepChooseTemplate } from './components/steps/StepChooseTemplate';
import { StepChooseProductLogo } from './components/steps/StepChooseProductLogo';
import { StepChooseBackground } from './components/steps/StepChooseBackground';
import { ProductLogo } from './data/productLogos';
import { StepAddImage } from './components/steps/StepAddImage';
import { StepEditHeadline } from './components/steps/StepEditHeadline';
import { StepEditSubtitle } from './components/steps/StepEditSubtitle';
import { StepDownload } from './components/steps/StepDownload';
import { AdminGuideModal } from './components/AdminGuideModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Custom user uploaded backgrounds (persisted in localStorage)
  const [customBackgrounds, setCustomBackgrounds] = useState<BackgroundItem[]>(() => {
    try {
      const saved = localStorage.getItem('linkedin_post_custom_backgrounds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('linkedin_post_custom_backgrounds', JSON.stringify(customBackgrounds));
    } catch (e) {
      console.error('Failed to save custom backgrounds to localStorage', e);
    }
  }, [customBackgrounds]);

  // Clean up any stale image persistence keys from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('linkedin_post_custom_images');
      localStorage.removeItem('linkedin_post_selected_image');
    } catch (e) {
      // ignore
    }
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const isAuthed = localStorage.getItem('linkedin_post_creator_authed');
    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }

    // Fetch server-persisted uploaded backgrounds
    fetch('/api/backgrounds')
      .then((res) => res.json())
      .then((serverBgs) => {
        if (Array.isArray(serverBgs) && serverBgs.length > 0) {
          setCustomBackgrounds((prev) => {
            const urls = new Set(prev.map((item) => item.url));
            const newItems = serverBgs.filter((item: BackgroundItem) => !urls.has(item.url));
            return [...prev, ...newItems];
          });
        }
      })
      .catch((err) => console.error('Failed to load server backgrounds:', err));
  }, []);

  const [currentStepId, setCurrentStepId] = useState<StepId>('template');
  const [completedSteps, setCompletedSteps] = useState<StepId[]>(['template']);
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState<boolean>(false);

  const canvasHandleRef = useRef<CanvasPreviewHandle | null>(null);

  // Initial Post State
  const initialTemplate = TEMPLATES[0];
  const [postState, setPostState] = useState<PostState>({
    selectedTemplateId: initialTemplate.id,
    selectedProductLogo: null,
    selectedBackgroundId: BACKGROUNDS[0]?.id || '',
    selectedImageId: '',
    secondaryImageId: null,
    imageScale: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    headlineText: initialTemplate.defaultHeadline,
    subtitleText: initialTemplate.defaultSubtitle,
    subtitleEnabled: true,
    productLogoText: initialTemplate.defaultProductLogo || 'FEM-Design',
    showSafeArea: false,
    showBrandWatermark: false,
    brandNameText: 'STRUSOFT • LINKEDIN TEAM'
  });

  // Session-only uploaded image state
  const [uploadedImage, setUploadedImage] = useState<{ file: File; url: string; name: string } | null>(null);

  const handleUploadImage = (file: File) => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    const objectUrl = URL.createObjectURL(file);
    setUploadedImage({ file, url: objectUrl, name: file.name });
    setPostState(prev => ({ ...prev, selectedImageId: 'custom-upload' }));
    markStepComplete('image');
  };

  const handleRemoveImage = () => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);
    setPostState(prev => ({ ...prev, selectedImageId: '', secondaryImageId: null }));
  };

  const allBackgrounds = [...customBackgrounds, ...BACKGROUNDS];

  const activeTemplate = TEMPLATES.find(t => t.id === postState.selectedTemplateId) || TEMPLATES[0];
  const activeBackground = allBackgrounds.find(b => b.id === postState.selectedBackgroundId) || allBackgrounds[0];
  const activeImage: LibraryImage | undefined = uploadedImage
    ? { id: 'custom-upload', name: uploadedImage.name, category: 'Uploaded', url: uploadedImage.url }
    : undefined;
  const activeSecondaryImage = undefined;

  const handleAddCustomBackground = (newBg: BackgroundItem) => {
    setCustomBackgrounds(prev => [newBg, ...prev]);
    setPostState(prev => ({ ...prev, selectedBackgroundId: newBg.id }));
    markStepComplete('background');
  };

  const handleSelectProductLogo = (logo: ProductLogo) => {
    setPostState(prev => ({ ...prev, selectedProductLogo: logo }));
    markStepComplete('productLogo');
  };

  // Handle template switch (resets image selections to null)
  const handleSelectTemplate = (templateId: string) => {
    const newTmpl = TEMPLATES.find(t => t.id === templateId);
    if (!newTmpl) return;

    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);

    setPostState(prev => ({
      ...prev,
      selectedTemplateId: templateId,
      headlineText: newTmpl.defaultHeadline,
      subtitleText: newTmpl.defaultSubtitle,
      subtitleEnabled: true,
      productLogoText: newTmpl.defaultProductLogo || prev.productLogoText || 'FEM-Design',
      selectedProductLogo: newTmpl.productLogoZone ? prev.selectedProductLogo : null,
      selectedImageId: '',
      secondaryImageId: null
    }));
    markStepComplete('template');
  };

  const handleSelectBackground = (bgId: string) => {
    setPostState(prev => ({ ...prev, selectedBackgroundId: bgId }));
    markStepComplete('background');
  };

  const markStepComplete = (stepId: StepId) => {
    setCompletedSteps(prev => (prev.includes(stepId) ? prev : [...prev, stepId]));
  };

  const handleSelectStep = (stepId: StepId) => {
    const targetIndex = STEPS.findIndex(s => s.id === stepId);
    if (targetIndex >= 2 && !postState.selectedProductLogo) {
      setCurrentStepId('productLogo');
      return;
    }
    setCurrentStepId(stepId);
  };

  const handleNextStep = () => {
    markStepComplete(currentStepId);
    const currentIndex = STEPS.findIndex(s => s.id === currentStepId);
    if (currentIndex < STEPS.length - 1) {
      const nextStepId = STEPS[currentIndex + 1].id;
      if (currentIndex + 1 >= 2 && !postState.selectedProductLogo) {
        setCurrentStepId('productLogo');
      } else {
        setCurrentStepId(nextStepId);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_post_creator_authed');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      {/* 1. Left Vertical Stepper Sidebar */}
      <SidebarStepper
        currentStepId={currentStepId}
        onSelectStep={handleSelectStep}
        completedSteps={completedSteps}
        onOpenAdminGuide={() => setIsAdminGuideOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Middle Editor Control Panel for Active Step */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 z-10 shadow-sm">
        <div className="space-y-6">
          {currentStepId === 'template' && (
            <StepChooseTemplate
              state={postState}
              onSelectTemplate={handleSelectTemplate}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'productLogo' && (
            <StepChooseProductLogo
              state={postState}
              onSelectProductLogo={handleSelectProductLogo}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'background' && (
            <StepChooseBackground
              state={postState}
              onSelectBackground={handleSelectBackground}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'image' && (
            <StepAddImage
              state={postState}
              template={activeTemplate}
              uploadedImage={uploadedImage}
              onUploadImage={handleUploadImage}
              onRemoveImage={handleRemoveImage}
              onUpdateState={setPostState}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'headline' && (
            <StepEditHeadline
              state={postState}
              template={activeTemplate}
              onUpdateState={setPostState}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'subtitle' && (
            <StepEditSubtitle
              state={postState}
              template={activeTemplate}
              onUpdateState={setPostState}
              onNextStep={handleNextStep}
            />
          )}

          {currentStepId === 'download' && (
            <StepDownload
              onExportPng={async () => {
                if (canvasHandleRef.current) {
                  return await canvasHandleRef.current.exportBlob();
                }
                return null;
              }}
            />
          )}
        </div>
      </div>

      {/* 3. Main Live Canvas Workspace */}
      <CanvasPreview
        ref={canvasHandleRef}
        state={postState}
        template={activeTemplate}
        background={activeBackground}
        libraryImage={activeImage}
        secondaryImage={activeSecondaryImage}
        onSelectStep={handleSelectStep}
        onUpdateState={setPostState}
      />

      {/* Admin Documentation Modal */}
      <AdminGuideModal
        isOpen={isAdminGuideOpen}
        onClose={() => setIsAdminGuideOpen(false)}
      />
    </div>
  );
}

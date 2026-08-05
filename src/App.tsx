import React, { useEffect, useRef, useState } from 'react';
import { StepId, PostState, LibraryImage } from './types';
import { TEMPLATES } from './data/templates';
import { BACKGROUNDS } from './data/backgrounds';

import { PasswordGate } from './components/PasswordGate';
import { SidebarStepper, STEPS } from './components/SidebarStepper';
import {
  CanvasPreview,
  CanvasPreviewHandle
} from './components/CanvasPreview';

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

  // Remove stale image persistence from previous implementations.
  useEffect(() => {
    try {
      localStorage.removeItem('linkedin_post_custom_images');
      localStorage.removeItem('linkedin_post_selected_image');
      localStorage.removeItem('linkedin_post_custom_backgrounds');
    } catch {
      // Ignore storage cleanup errors.
    }
  }, []);

  // Restore existing authenticated session.
  useEffect(() => {
    const isAuthed = localStorage.getItem('linkedin_post_creator_authed');

    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const [currentStepId, setCurrentStepId] =
    useState<StepId>('template');

  const [completedSteps, setCompletedSteps] =
    useState<StepId[]>(['template']);

  const [isAdminGuideOpen, setIsAdminGuideOpen] =
    useState<boolean>(false);

  const canvasHandleRef =
    useRef<CanvasPreviewHandle | null>(null);

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
    productLogoText:
      initialTemplate.defaultProductLogo || 'FEM-Design',
    showSafeArea: false,
    showBrandWatermark: false,
    brandNameText: 'STRUSOFT • LINKEDIN TEAM'
  });

  // Current-session custom image only.
  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    url: string;
    name: string;
  } | null>(null);

  const markStepComplete = (stepId: StepId) => {
    setCompletedSteps((previousSteps) =>
      previousSteps.includes(stepId)
        ? previousSteps
        : [...previousSteps, stepId]
    );
  };

  const handleUploadImage = (file: File) => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }

    const objectUrl = URL.createObjectURL(file);

    setUploadedImage({
      file,
      url: objectUrl,
      name: file.name
    });

    setPostState((previousState) => ({
      ...previousState,
      selectedImageId: 'custom-upload'
    }));

    markStepComplete('image');
  };

  const handleRemoveImage = () => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }

    setUploadedImage(null);

    setPostState((previousState) => ({
      ...previousState,
      selectedImageId: '',
      secondaryImageId: null
    }));
  };

  const activeTemplate =
    TEMPLATES.find(
      (template) =>
        template.id === postState.selectedTemplateId
    ) || TEMPLATES[0];

  const activeBackground =
    BACKGROUNDS.find(
      (background) =>
        background.id === postState.selectedBackgroundId
    ) || BACKGROUNDS[0];

  const activeImage: LibraryImage | undefined = uploadedImage
    ? {
        id: 'custom-upload',
        name: uploadedImage.name,
        category: 'Uploaded',
        url: uploadedImage.url
      }
    : undefined;

  const activeSecondaryImage: LibraryImage | undefined = undefined;

  const handleSelectProductLogo = (logo: ProductLogo) => {
    setPostState((previousState) => ({
      ...previousState,
      selectedProductLogo: logo
    }));

    markStepComplete('productLogo');
  };

  const handleSelectTemplate = (templateId: string) => {
    const newTemplate = TEMPLATES.find(
      (template) => template.id === templateId
    );

    if (!newTemplate) {
      return;
    }

    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }

    setUploadedImage(null);

    setPostState((previousState) => ({
      ...previousState,
      selectedTemplateId: templateId,
      headlineText: newTemplate.defaultHeadline,
      subtitleText: newTemplate.defaultSubtitle,
      subtitleEnabled: true,
      productLogoText:
        newTemplate.defaultProductLogo ||
        previousState.productLogoText ||
        'FEM-Design',
      selectedProductLogo: newTemplate.productLogoZone
        ? previousState.selectedProductLogo
        : null,
      selectedImageId: '',
      secondaryImageId: null
    }));

    markStepComplete('template');
  };

  const handleSelectBackground = (backgroundId: string) => {
    setPostState((previousState) => ({
      ...previousState,
      selectedBackgroundId: backgroundId
    }));

    markStepComplete('background');
  };

  const handleSelectStep = (stepId: StepId) => {
    const targetIndex = STEPS.findIndex(
      (step) => step.id === stepId
    );

    if (
      targetIndex >= 2 &&
      !postState.selectedProductLogo
    ) {
      setCurrentStepId('productLogo');
      return;
    }

    setCurrentStepId(stepId);
  };

  const handleNextStep = () => {
    markStepComplete(currentStepId);

    const currentIndex = STEPS.findIndex(
      (step) => step.id === currentStepId
    );

    if (currentIndex >= STEPS.length - 1) {
      return;
    }

    const nextStepId = STEPS[currentIndex + 1].id;

    if (
      currentIndex + 1 >= 2 &&
      !postState.selectedProductLogo
    ) {
      setCurrentStepId('productLogo');
      return;
    }

    setCurrentStepId(nextStepId);
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_post_creator_authed');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <PasswordGate
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      <SidebarStepper
        currentStepId={currentStepId}
        onSelectStep={handleSelectStep}
        completedSteps={completedSteps}
        onOpenAdminGuide={() => setIsAdminGuideOpen(true)}
        onLogout={handleLogout}
      />

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
                if (!canvasHandleRef.current) {
                  return null;
                }

                return await canvasHandleRef.current.exportBlob();
              }}
            />
          )}
        </div>
      </div>

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

      <AdminGuideModal
        isOpen={isAdminGuideOpen}
        onClose={() => setIsAdminGuideOpen(false)}
      />
    </div>
  );
}

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
    selectedImage1Id: '',
    selectedImage2Id: null,
    image1Scale: 1.0,
    image1PanX: 0,
    image1PanY: 0,
    image2Scale: 1.0,
    image2PanX: 0,
    image2PanY: 0,
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

  // Uploaded images for Image 1 and Image 2
  const [uploadedImage1, setUploadedImage1] = useState<{
    file: File;
    url: string;
    name: string;
  } | null>(null);

  const [uploadedImage2, setUploadedImage2] = useState<{
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

  const handleUploadImage1 = (file: File) => {
    if (uploadedImage1?.url) {
      URL.revokeObjectURL(uploadedImage1.url);
    }

    const objectUrl = URL.createObjectURL(file);

    setUploadedImage1({
      file,
      url: objectUrl,
      name: file.name
    });

    setPostState((previousState) => ({
      ...previousState,
      selectedImage1Id: 'custom-upload-1',
      selectedImageId: 'custom-upload-1'
    }));

    markStepComplete('image');
  };

  const handleRemoveImage1 = () => {
    if (uploadedImage1?.url) {
      URL.revokeObjectURL(uploadedImage1.url);
    }

    setUploadedImage1(null);

    setPostState((previousState) => ({
      ...previousState,
      selectedImage1Id: '',
      selectedImageId: ''
    }));
  };

  const handleUploadImage2 = (file: File) => {
    if (uploadedImage2?.url) {
      URL.revokeObjectURL(uploadedImage2.url);
    }

    const objectUrl = URL.createObjectURL(file);

    setUploadedImage2({
      file,
      url: objectUrl,
      name: file.name
    });

    setPostState((previousState) => ({
      ...previousState,
      selectedImage2Id: 'custom-upload-2',
      secondaryImageId: 'custom-upload-2'
    }));

    markStepComplete('image');
  };

  const handleRemoveImage2 = () => {
    if (uploadedImage2?.url) {
      URL.revokeObjectURL(uploadedImage2.url);
    }

    setUploadedImage2(null);

    setPostState((previousState) => ({
      ...previousState,
      selectedImage2Id: null,
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

  const isDualLayout = Boolean(activeTemplate.secondaryImageSlot);

  const activeImage: LibraryImage | undefined = isDualLayout
    ? (uploadedImage2
        ? {
            id: 'custom-upload-2',
            name: uploadedImage2.name,
            category: 'Uploaded',
            url: uploadedImage2.url
          }
        : undefined)
    : (uploadedImage1
        ? {
            id: 'custom-upload-1',
            name: uploadedImage1.name,
            category: 'Uploaded',
            url: uploadedImage1.url
          }
        : undefined);

  const activeSecondaryImage: LibraryImage | undefined = isDualLayout
    ? (uploadedImage1
        ? {
            id: 'custom-upload-1',
            name: uploadedImage1.name,
            category: 'Uploaded',
            url: uploadedImage1.url
          }
        : undefined)
    : undefined;

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

    if (uploadedImage1?.url) {
      URL.revokeObjectURL(uploadedImage1.url);
    }
    if (uploadedImage2?.url) {
      URL.revokeObjectURL(uploadedImage2.url);
    }

    setUploadedImage1(null);
    setUploadedImage2(null);

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
      selectedImage1Id: '',
      selectedImage2Id: null,
      selectedImageId: '',
      secondaryImageId: null,
      image1Scale: 1.0,
      image1PanX: 0,
      image1PanY: 0,
      image2Scale: 1.0,
      image2PanX: 0,
      image2PanY: 0,
      imageScale: 1.0,
      imagePanX: 0,
      imagePanY: 0
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
              uploadedImage={uploadedImage1}
              uploadedImage1={uploadedImage1}
              uploadedImage2={uploadedImage2}
              onUploadImage={handleUploadImage1}
              onUploadImage1={handleUploadImage1}
              onUploadImage2={handleUploadImage2}
              onRemoveImage={handleRemoveImage1}
              onRemoveImage1={handleRemoveImage1}
              onRemoveImage2={handleRemoveImage2}
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

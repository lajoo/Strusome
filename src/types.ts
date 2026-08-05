export type StepId = 'template' | 'productLogo' | 'background' | 'image' | 'headline' | 'subtitle' | 'download';

export interface StepInfo {
  id: StepId;
  number: number;
  title: string;
  shortDesc: string;
  instruction: string;
}

export interface ImageSlotConfig {
  x: number; // 0 to 1080
  y: number; // 0 to 1080
  width: number;
  height: number;
  shape: 'rect' | 'circle' | 'rounded-rect';
  borderRadius?: number;
  label: string;
  borderWidth?: number;
  borderColor?: string;
}

export interface TextZoneConfig {
  x: number;
  y: number;
  width: number;
  height?: number;
  maxFontSize: number;
  minFontSize: number;
  maxChars: number;
  align: 'left' | 'center' | 'right';
  color: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  placeholder: string;
}

export interface CardOverlayConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius: number;
  shadow?: boolean;
}

export interface ProductLogoZoneConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  placeholder?: string;
}

export interface TopRightBrandConfig {
  text: string;
  bgColor: string;
  textColor: string;
  width: number;
  height: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  layoutStyle: 'strusoft-single' | 'strusoft-dual';
  badgeText?: string;
  accentColor: string;
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultProductLogo?: string;
  topRightBrand?: TopRightBrandConfig;
  productLogoZone?: ProductLogoZoneConfig;
  imageSlot: ImageSlotConfig;
  secondaryImageSlot?: ImageSlotConfig;
  headlineZone: TextZoneConfig;
  subtitleZone: TextZoneConfig;
  cardOverlay?: CardOverlayConfig;
  thumbnailBg: string;
}

export interface BackgroundItem {
  id: string;
  name: string;
  category: 'Architectural' | 'Minimal' | 'Gradients' | 'Tech & Modern' | 'Dark Luxury' | 'Corporate' | string;
  url: string; // High quality image URL or Firebase Storage URL
  storagePath?: string; // Target path in Firebase Storage
  tags: string[];
}

export interface LibraryImage {
  id: string;
  name: string;
  category: 'Uploaded' | 'Execs & Team' | 'Office & Work' | 'Tech & Data' | 'Abstract & Shapes' | string;
  url: string;
  tagline?: string;
}

export interface PostState {
  selectedTemplateId: string;
  selectedProductLogo: { id: string; name: string; src: string } | null;
  selectedBackgroundId: string;
  selectedImage1Id?: string | null;
  selectedImage2Id?: string | null;
  image1Scale: number;
  image1PanX: number;
  image1PanY: number;
  image2Scale: number;
  image2PanX: number;
  image2PanY: number;
  selectedImageId: string | null;
  secondaryImageId?: string | null;
  imageScale: number; // 0.5 to 3.0
  imagePanX: number; // -200 to +200
  imagePanY: number; // -200 to +200
  headlineText: string;
  subtitleText: string;
  subtitleEnabled?: boolean;
  productLogoText: string;
  textColorOverride?: string;
  accentColorOverride?: string;
  showSafeArea: boolean;
  showBrandWatermark: boolean;
  brandNameText: string;
}

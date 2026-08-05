import { TemplateConfig } from '../types';

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'strusoft-single',
    name: 'StruSoft Single Focus',
    tagline: 'Standard StruSoft post wireframe with Product Logo, Headline, Subtitle, & Main Image',
    description: 'Direct 1:1 implementation of StruSoft Template #1. Features top-right StruSoft corporate badge, product logo box, and large bottom-right showcase image.',
    category: 'StruSoft Corporate',
    layoutStyle: 'strusoft-single',
    accentColor: '#0062A8',
    defaultProductLogo: 'FEM-Design',
    defaultHeadline: 'Design & Calculate Complex 3D Structures with Precision',
    defaultSubtitle: 'Discover the latest productivity features in FEM-Design 23',
    thumbnailBg: 'linear-gradient(135deg, #00529B 0%, #002D62 100%)',
    topRightBrand: {
      text: 'StruSoft',
      bgColor: '#00529B',
      textColor: '#FFFFFF',
      width: 150,
      height: 150
    },
    productLogoZone: {
      x: 275,
      y: 135,
      width: 515,
      height: 155,
      borderRadius: 20,
      placeholder: '+ Product logo'
    },
    headlineZone: {
      x: 275,
      y: 310,
      width: 705,
      height: 80,
      maxFontSize: 60,
      minFontSize: 24,
      maxChars: 85,
      align: 'left',
      color: '#1D5998',
      fontFamily: '"Alwyn New", sans-serif',
      fontWeight: '800',
      lineHeight: 1.2,
      placeholder: '+ Headline'
    },
    subtitleZone: {
      x: 275,
      y: 405,
      width: 705,
      height: 80,
      maxFontSize: 35,
      minFontSize: 18,
      maxChars: 95,
      align: 'left',
      color: '#1D5998',
      fontFamily: '"Alwyn New", sans-serif',
      fontWeight: '600',
      lineHeight: 1.3,
      placeholder: '+ Subtitle'
    },
    imageSlot: {
      x: 275,
      y: 505,
      width: 805,
      height: 460,
      shape: 'rounded-rect',
      borderRadius: 24,
      label: '+ Image',
      borderWidth: 4,
      borderColor: '#0062A8'
    }
  },
  {
    id: 'strusoft-dual',
    name: 'StruSoft Dual Feature',
    tagline: 'Multi-photo layout with side accent frame and main feature image',
    description: 'Direct 1:1 implementation of StruSoft Template #2. Splits the lower half into a left accent image slot and a right main showcase photo.',
    category: 'StruSoft Corporate',
    layoutStyle: 'strusoft-dual',
    accentColor: '#0062A8',
    defaultProductLogo: 'WIN-Statik',
    defaultHeadline: 'Accelerate Concrete & Timber Calculation Workflows',
    defaultSubtitle: 'Combine section analysis with integrated 3D visual preview',
    thumbnailBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    topRightBrand: {
      text: 'StruSoft',
      bgColor: '#00529B',
      textColor: '#FFFFFF',
      width: 150,
      height: 150
    },
    productLogoZone: {
      x: 385,
      y: 135,
      width: 515,
      height: 155,
      borderRadius: 20,
      placeholder: '+ Product logo'
    },
    headlineZone: {
      x: 385,
      y: 310,
      width: 595,
      height: 80,
      maxFontSize: 60,
      minFontSize: 22,
      maxChars: 80,
      align: 'left',
      color: '#1D5998',
      fontFamily: '"Alwyn New", sans-serif',
      fontWeight: '800',
      lineHeight: 1.2,
      placeholder: '+ Headline'
    },
    subtitleZone: {
      x: 385,
      y: 405,
      width: 595,
      height: 80,
      maxFontSize: 35,
      minFontSize: 18,
      maxChars: 90,
      align: 'left',
      color: '#1D5998',
      fontFamily: '"Alwyn New", sans-serif',
      fontWeight: '600',
      lineHeight: 1.3,
      placeholder: '+ Subtitle'
    },
    secondaryImageSlot: {
      x: -20,
      y: 505,
      width: 360,
      height: 460,
      shape: 'rounded-rect',
      borderRadius: 24,
      label: '+ Image',
      borderWidth: 4,
      borderColor: '#0062A8'
    },
    imageSlot: {
      x: 385,
      y: 505,
      width: 695,
      height: 460,
      shape: 'rounded-rect',
      borderRadius: 24,
      label: '+ Main Image',
      borderWidth: 4,
      borderColor: '#0062A8'
    }
  }
];

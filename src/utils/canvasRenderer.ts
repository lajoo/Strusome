import { PostState, TemplateConfig, BackgroundItem, LibraryImage } from '../types';

export function renderPostToCanvas(
  canvas: HTMLCanvasElement,
  state: PostState,
  template: TemplateConfig,
  bgItem: BackgroundItem | undefined,
  selectedImgItem: LibraryImage | undefined,
  bgImageElement: HTMLImageElement | null,
  slotImageElement: HTMLImageElement | null,
  secondaryImageElement: HTMLImageElement | null = null,
  productLogoImageElement: HTMLImageElement | null = null,
  strusoftLogoImageElement: HTMLImageElement | null = null,
  options: { scaleFactor?: number; isExport?: boolean } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const targetWidth = 1080;
  const targetHeight = 1080;

  // Set logical canvas size to 1080x1080
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.clearRect(0, 0, targetWidth, targetHeight);

  // 1. Draw Background
  if (bgImageElement && bgImageElement.complete) {
    ctx.drawImage(bgImageElement, 0, 0, targetWidth, targetHeight);
  } else {
    // Default fallback background for StruSoft wireframe templates is crisp clean white
    if (template.layoutStyle.startsWith('strusoft')) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else {
      const grad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
  }

  // 2. Draw Top-Right StruSoft Corporate Logo
  if (strusoftLogoImageElement && strusoftLogoImageElement.complete) {
    ctx.save();
    const logoBoxWidth = 100;
    const logoBoxHeight = 100;
    const logoX = targetWidth - logoBoxWidth; // 980
    const logoY = 0; // 0px top margin

    const imgW = strusoftLogoImageElement.width;
    const imgH = strusoftLogoImageElement.height;
    const imgAspect = imgW / imgH;

    let drawW = logoBoxWidth;
    let drawH = logoBoxHeight;

    if (imgAspect > 1) {
      drawW = logoBoxWidth;
      drawH = logoBoxWidth / imgAspect;
    } else {
      drawH = logoBoxHeight;
      drawW = logoBoxHeight * imgAspect;
    }

    const drawX = logoX + (logoBoxWidth - drawW);
    const drawY = logoY;

    ctx.drawImage(strusoftLogoImageElement, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else if (template.topRightBrand && !template.layoutStyle.startsWith('strusoft')) {
    const brand = template.topRightBrand;
    ctx.save();
    ctx.fillStyle = brand.bgColor;
    const badgeX = targetWidth - brand.width;
    const badgeY = 0;
    ctx.fillRect(badgeX, badgeY, brand.width, brand.height);

    ctx.fillStyle = brand.textColor;
    ctx.font = '700 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brand.text, badgeX + brand.width / 2, badgeY + brand.height / 2);
    ctx.restore();
  }

  // 5. Draw Product Logo Zone
  if (template.productLogoZone) {
    const zone = template.productLogoZone;
    ctx.save();

    if (productLogoImageElement && productLogoImageElement.complete) {
      const imgAspect = productLogoImageElement.width / productLogoImageElement.height;
      const zoneAspect = zone.width / zone.height;

      let drawW = zone.width;
      let drawH = zone.height;

      if (imgAspect > zoneAspect) {
        drawW = zone.width;
        drawH = zone.width / imgAspect;
      } else {
        drawH = zone.height;
        drawW = drawH * imgAspect;
      }

      const drawX = zone.x + (zone.width - drawW) / 2;
      const drawY = zone.y + (zone.height - drawH) / 2;

      ctx.drawImage(productLogoImageElement, drawX, drawY, drawW, drawH);
    }

    ctx.restore();
  }

  // 6. Draw Headline Zone (directly on background image)
  const hlZone = template.headlineZone;
  const subZone = template.subtitleZone;

  const subtitleEnabled = state.subtitleEnabled !== false;
  const subtitleRawText = state.subtitleText !== undefined ? state.subtitleText : template.defaultSubtitle;
  const hasSubtitle = subtitleEnabled && subtitleRawText.trim().length > 0;

  const headlineText = state.headlineText || template.defaultHeadline;

  // Calculate expanded headline zone bounds when subtitle is disabled or empty
  const expandedHeadlineBottom = subZone.y + (subZone.height || 80);
  const expandedHeadlineHeight = expandedHeadlineBottom - hlZone.y;

  const maxHeadlineFontSize = hasSubtitle ? 60 : 72;
  const targetHeadlineZoneHeight = hasSubtitle ? (hlZone.height || 80) : expandedHeadlineHeight;

  ctx.save();
  ctx.fillStyle = template.layoutStyle.startsWith('strusoft') ? '#1D5998' : (state.textColorOverride || hlZone.color);
  ctx.textAlign = hlZone.align;
  ctx.textBaseline = 'top';

  const fontObj = fitTextInZone(
    ctx,
    headlineText,
    hlZone.width,
    targetHeadlineZoneHeight,
    maxHeadlineFontSize,
    hlZone.minFontSize,
    hlZone.fontWeight,
    hlZone.fontFamily || '"Alwyn New", sans-serif',
    hlZone.lineHeight || 1.2
  );

  ctx.font = fontObj.fontStr;
  const lines = fontObj.lines;
  const lineHeightPx = fontObj.fontSize * (hlZone.lineHeight || 1.2);

  let startX = hlZone.x;
  if (hlZone.align === 'center') {
    startX = hlZone.x + hlZone.width / 2;
  } else if (hlZone.align === 'right') {
    startX = hlZone.x + hlZone.width;
  }

  let startY = hlZone.y;
  if (!hasSubtitle) {
    const totalTextBlockHeight = lines.length * lineHeightPx;
    startY = hlZone.y + Math.max(0, (expandedHeadlineHeight - totalTextBlockHeight) / 2);
  }

  lines.forEach((line, idx) => {
    ctx.fillText(line, startX, startY + idx * lineHeightPx);
  });
  ctx.restore();

  // 7. Draw Subtitle Zone ONLY if hasSubtitle is true
  if (hasSubtitle) {
    ctx.save();
    ctx.fillStyle = template.layoutStyle.startsWith('strusoft') ? '#1D5998' : subZone.color;
    ctx.textAlign = subZone.align;
    ctx.textBaseline = 'top';

    const subFontObj = fitTextInZone(
      ctx,
      subtitleRawText,
      subZone.width,
      subZone.height || 80,
      Math.min(subZone.maxFontSize, 35),
      subZone.minFontSize,
      subZone.fontWeight,
      subZone.fontFamily || '"Alwyn New", sans-serif',
      subZone.lineHeight || 1.3
    );

    ctx.font = subFontObj.fontStr;
    const subLines = subFontObj.lines;
    const subLineHeightPx = subFontObj.fontSize * (subZone.lineHeight || 1.3);

    let subStartX = subZone.x;
    if (subZone.align === 'center') {
      subStartX = subZone.x + subZone.width / 2;
    } else if (subZone.align === 'right') {
      subStartX = subZone.x + subZone.width;
    }

    subLines.forEach((line, idx) => {
      ctx.fillText(line, subStartX, subZone.y + idx * subLineHeightPx);
    });
    ctx.restore();
  }

  // 8. Draw Secondary Image Slot (if defined, e.g. Template 2 Left Image Slot)
  if (template.secondaryImageSlot) {
    const secSlot = template.secondaryImageSlot;
    ctx.save();

    // Clipping path
    ctx.beginPath();
    drawRoundedRectPath(ctx, secSlot.x, secSlot.y, secSlot.width, secSlot.height, secSlot.borderRadius || 24);
    ctx.clip();

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    if (secondaryImageElement && secondaryImageElement.complete) {
      drawFitImageInSlot(ctx, secondaryImageElement, secSlot, 1.0, 0, 0);
    } else {
      // Wireframe placeholder matching image 2 "+ Image"
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(secSlot.x, secSlot.y, secSlot.width, secSlot.height);

      ctx.fillStyle = '#0062A8';
      ctx.font = '700 48px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(secSlot.label, secSlot.x + secSlot.width / 2 + 10, secSlot.y + secSlot.height / 2);
    }
    ctx.restore();

    // Border outline for secondary slot if defined
    if (secSlot.borderWidth && !template.layoutStyle.startsWith('strusoft')) {
      ctx.save();
      ctx.strokeStyle = template.accentColor || '#0062A8';
      ctx.lineWidth = secSlot.borderWidth || 4;
      drawRoundedRectPath(ctx, secSlot.x, secSlot.y, secSlot.width, secSlot.height, secSlot.borderRadius || 24);
      ctx.stroke();
      ctx.restore();
    }
  }

  // 9. Draw Main Image Slot
  const slot = template.imageSlot;
  const slotW = targetWidth - slot.x; // extends all the way to right canvas edge (1080)
  const slotH = slot.height;

  const createMainSlotPath = () => {
    ctx.beginPath();
    if (slot.shape === 'circle') {
      const radius = slot.width / 2;
      ctx.arc(slot.x + radius, slot.y + radius, radius, 0, Math.PI * 2);
    } else if (template.layoutStyle.startsWith('strusoft')) {
      // Custom clip path: Top-left: 30px, Bottom-left: 30px, Top-right: 0px, Bottom-right: 0px
      const x = slot.x;
      const y = slot.y;
      const w = slotW;
      const h = slotH;
      const r = 30;

      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    } else {
      drawRoundedRectPath(ctx, slot.x, slot.y, slot.width, slot.height, slot.borderRadius || 24);
    }
  };

  if (slotImageElement && slotImageElement.complete) {
    const renderSlot = template.layoutStyle.startsWith('strusoft')
      ? { x: slot.x, y: slot.y, width: slotW, height: slotH }
      : slot;

    // 1. Draw centered drop shadow for image
    ctx.save();
    createMainSlotPath();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // 2. Draw clipped image over shadow fill
    ctx.save();
    createMainSlotPath();
    ctx.clip();
    drawFitImageInSlot(ctx, slotImageElement, renderSlot, state.imageScale || 1.0, state.imagePanX || 0, state.imagePanY || 0);
    ctx.restore();
  } else {
    // Wireframe placeholder when no image is selected
    ctx.save();
    createMainSlotPath();
    ctx.clip();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

    ctx.fillStyle = '#0062A8';
    ctx.font = '700 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.label || '+ Image', slot.x + slot.width / 2, slot.y + slot.height / 2);
    ctx.restore();
  }

  // Draw Main Slot Border (only for non-strusoft templates)
  if (slot.borderWidth && !template.layoutStyle.startsWith('strusoft')) {
    ctx.save();
    ctx.beginPath();
    if (slot.shape === 'circle') {
      const radius = slot.width / 2;
      ctx.arc(slot.x + radius, slot.y + radius, radius, 0, Math.PI * 2);
    } else {
      drawRoundedRectPath(ctx, slot.x, slot.y, slot.width, slot.height, slot.borderRadius || 24);
    }
    ctx.strokeStyle = state.accentColorOverride || slot.borderColor || template.accentColor;
    ctx.lineWidth = slot.borderWidth;
    ctx.stroke();
    ctx.restore();
  }

  // 10. Draw Watermark / Brand Name (optional overlay)
  if (state.showBrandWatermark && !template.layoutStyle.startsWith('strusoft')) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 14px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(state.brandNameText || 'STRUSOFT • LINKEDIN TEAM', targetWidth - 50, targetHeight - 40);

    ctx.fillStyle = template.accentColor;
    ctx.beginPath();
    ctx.arc(targetWidth - 50 - ctx.measureText(state.brandNameText || 'STRUSOFT • LINKEDIN TEAM').width - 16, targetHeight - 45, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 12. Draw Safe Area Overlays if enabled
  if (state.showSafeArea && !options.isExport) {
    ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    ctx.strokeRect(50, 50, targetWidth - 100, targetHeight - 100);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.fillRect(0, 0, targetWidth, 50);
    ctx.fillRect(0, 1030, targetWidth, 50);

    ctx.fillStyle = '#EF4444';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SAFE AREA MARGIN (1080x1080 FEED PREVIEW)', 60, 40);
    ctx.restore();
  }
}

// Helper: Fit Image into slot with scale & pan
function drawFitImageInSlot(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: { x: number; y: number; width: number; height: number },
  scale: number,
  panX: number,
  panY: number
) {
  const imgAspect = img.width / img.height;
  const slotAspect = slot.width / slot.height;

  let drawW = slot.width;
  let drawH = slot.height;

  if (imgAspect > slotAspect) {
    drawH = slot.height * scale;
    drawW = drawH * imgAspect;
  } else {
    drawW = slot.width * scale;
    drawH = drawW / imgAspect;
  }

  const drawX = slot.x + (slot.width - drawW) / 2 + panX;
  const drawY = slot.y + (slot.height - drawH) / 2 + panY;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

// Helper: Truncate text with ellipsis
function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

// Helper: Draw rounded rectangle path
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: Word wrap & font size fitting
function fitTextInZone(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  maxSize: number,
  minSize: number,
  weight: string,
  family: string,
  lineHeightRatio: number = 1.2
): { lines: string[]; fontSize: number; fontStr: string } {
  let currentSize = maxSize;

  while (currentSize >= minSize) {
    const fontStr = `${weight} ${currentSize}px ${family}`;
    ctx.font = fontStr;

    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';
    let hasHorizontalOverflow = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (ctx.measureText(word).width > maxWidth) {
        hasHorizontalOverflow = true;
        break;
      }

      if (!currentLine) {
        currentLine = word;
      } else {
        const testLine = currentLine + ' ' + word;
        if (ctx.measureText(testLine).width <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
    }
    if (currentLine && !hasHorizontalOverflow) {
      lines.push(currentLine);
    }

    const lineHeightPx = currentSize * lineHeightRatio;
    const totalHeight = lines.length * lineHeightPx;
    const hasVerticalOverflow = totalHeight > maxHeight;

    if (!hasHorizontalOverflow && !hasVerticalOverflow && lines.length > 0) {
      return { lines, fontSize: currentSize, fontStr };
    }

    if (currentSize === minSize) {
      return { lines: lines.length > 0 ? lines : [text], fontSize: minSize, fontStr };
    }

    currentSize -= 1;
  }

  const fontStr = `${weight} ${minSize}px ${family}`;
  return { lines: [text], fontSize: minSize, fontStr };
}

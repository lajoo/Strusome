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

  // 2. Draw Top-Right Brand Badge (e.g. StruSoft logo box)
  if (template.topRightBrand) {
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

  // 3. Draw Card Overlay if template defines one
  if (template.cardOverlay) {
    const card = template.cardOverlay;
    ctx.save();
    if (card.shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
    }

    ctx.fillStyle = card.bgColor;
    drawRoundedRectPath(ctx, card.x, card.y, card.width, card.height, card.borderRadius);
    ctx.fill();

    if (card.borderColor) {
      ctx.strokeStyle = card.borderColor;
      ctx.lineWidth = card.borderWidth || 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Draw Badge Tag (for non-StruSoft standard templates)
  if (template.badgeText) {
    ctx.save();
    let badgeX = 560;
    let badgeY = 220;

    if (template.layoutStyle === 'quote') {
      badgeX = 150;
      badgeY = 160;
    } else if (template.layoutStyle === 'announcement') {
      badgeX = 130;
      badgeY = 120;
    }

    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    const textMetrics = ctx.measureText(template.badgeText);
    const badgePaddingH = 16;
    const badgeHeight = 32;
    const badgeWidth = textMetrics.width + badgePaddingH * 2;

    const accentColor = state.accentColorOverride || template.accentColor;

    ctx.fillStyle = accentColor;
    drawRoundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(template.badgeText, badgeX + badgePaddingH, badgeY + badgeHeight / 2);
    ctx.restore();
  }

  // 5. Draw Product Logo Zone (StruSoft pill container)
  if (template.productLogoZone) {
    const zone = template.productLogoZone;
    ctx.save();

    // Draw container rounded pill outline
    ctx.strokeStyle = template.accentColor || '#0062A8';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRectPath(ctx, zone.x, zone.y, zone.width, zone.height, zone.borderRadius || 20);
    ctx.fill();
    ctx.stroke();

    // Draw Product Logo Content
    const logoText = state.productLogoText || template.defaultProductLogo || 'Product logo';
    ctx.fillStyle = '#004B87';
    ctx.font = '700 44px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('+ ' + logoText, zone.x + 30, zone.y + zone.height / 2);

    ctx.restore();
  }

  // 6. Draw Headline Zone Container & Text
  const hlZone = template.headlineZone;
  const headlineText = state.headlineText || template.defaultHeadline;

  ctx.save();
  if (template.layoutStyle.startsWith('strusoft')) {
    // Draw rounded outline container matching wireframe image
    ctx.strokeStyle = template.accentColor || '#0062A8';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRectPath(ctx, hlZone.x, hlZone.y, hlZone.width, hlZone.height || 80, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = state.textColorOverride || hlZone.color;
    ctx.font = '700 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const displayText = headlineText.startsWith('+') ? headlineText : '+ ' + headlineText;
    ctx.fillText(truncateText(ctx, displayText, hlZone.width - 40), hlZone.x + 30, hlZone.y + (hlZone.height || 80) / 2);
  } else {
    ctx.fillStyle = state.textColorOverride || hlZone.color;
    ctx.textAlign = hlZone.align;
    ctx.textBaseline = 'top';

    const fontObj = fitTextInZone(
      ctx,
      headlineText,
      hlZone.width,
      hlZone.maxFontSize,
      hlZone.minFontSize,
      hlZone.fontWeight,
      hlZone.fontFamily
    );

    ctx.font = fontObj.fontStr;
    const lines = fontObj.lines;
    const lineHeightPx = fontObj.fontSize * (hlZone.lineHeight || 1.25);

    let startX = hlZone.x;
    if (hlZone.align === 'center') {
      startX = hlZone.x + hlZone.width / 2;
    } else if (hlZone.align === 'right') {
      startX = hlZone.x + hlZone.width;
    }

    lines.forEach((line, idx) => {
      ctx.fillText(line, startX, hlZone.y + idx * lineHeightPx);
    });
  }
  ctx.restore();

  // 7. Draw Subtitle Zone Container & Text
  const subZone = template.subtitleZone;
  const subtitleText = state.subtitleText || template.defaultSubtitle;

  ctx.save();
  if (template.layoutStyle.startsWith('strusoft')) {
    // Draw rounded outline container matching wireframe image
    ctx.strokeStyle = template.accentColor || '#0062A8';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRectPath(ctx, subZone.x, subZone.y, subZone.width, subZone.height || 80, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = subZone.color;
    ctx.font = '600 26px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const displayText = subtitleText.startsWith('+') ? subtitleText : '+ ' + subtitleText;
    ctx.fillText(truncateText(ctx, displayText, subZone.width - 40), subZone.x + 30, subZone.y + (subZone.height || 80) / 2);
  } else {
    ctx.fillStyle = subZone.color;
    ctx.textAlign = subZone.align;
    ctx.textBaseline = 'top';

    const subFontObj = fitTextInZone(
      ctx,
      subtitleText,
      subZone.width,
      subZone.maxFontSize,
      subZone.minFontSize,
      subZone.fontWeight,
      subZone.fontFamily
    );

    ctx.font = subFontObj.fontStr;
    const subLines = subFontObj.lines;
    const subLineHeightPx = subFontObj.fontSize * 1.35;

    let subStartX = subZone.x;
    if (subZone.align === 'center') {
      subStartX = subZone.x + subZone.width / 2;
    } else if (subZone.align === 'right') {
      subStartX = subZone.x + subZone.width;
    }

    subLines.forEach((line, idx) => {
      ctx.fillText(line, subStartX, subZone.y + idx * subLineHeightPx);
    });
  }
  ctx.restore();

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

    // Border outline
    ctx.save();
    ctx.strokeStyle = template.accentColor || '#0062A8';
    ctx.lineWidth = secSlot.borderWidth || 4;
    drawRoundedRectPath(ctx, secSlot.x, secSlot.y, secSlot.width, secSlot.height, secSlot.borderRadius || 24);
    ctx.stroke();
    ctx.restore();
  }

  // 9. Draw Main Image Slot
  const slot = template.imageSlot;
  ctx.save();

  // Create clipping mask path for main slot
  ctx.beginPath();
  if (slot.shape === 'circle') {
    const radius = slot.width / 2;
    ctx.arc(slot.x + radius, slot.y + radius, radius, 0, Math.PI * 2);
  } else {
    drawRoundedRectPath(ctx, slot.x, slot.y, slot.width, slot.height, slot.borderRadius || 24);
  }
  ctx.clip();

  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  if (slotImageElement && slotImageElement.complete) {
    drawFitImageInSlot(ctx, slotImageElement, slot, state.imageScale || 1.0, state.imagePanX || 0, state.imagePanY || 0);
  } else {
    // Wireframe placeholder matching template images "+ Image" or "+ Main Image"
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

    ctx.fillStyle = '#0062A8';
    ctx.font = '700 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.label, slot.x + slot.width / 2, slot.y + slot.height / 2);
  }
  ctx.restore();

  // Draw Main Slot Border
  if (slot.borderWidth) {
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

  // 10. Draw Bottom-Left "+ Background" Label for StruSoft templates
  if (template.layoutStyle.startsWith('strusoft')) {
    ctx.save();
    ctx.fillStyle = '#0062A8';
    ctx.font = '700 44px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('+ Background', 30, targetHeight - 35);
    ctx.restore();
  }

  // 11. Draw Watermark / Brand Name (optional overlay)
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
  maxSize: number,
  minSize: number,
  weight: string,
  family: string
): { lines: string[]; fontSize: number; fontStr: string } {
  let currentSize = maxSize;

  while (currentSize >= minSize) {
    const fontStr = `${weight} ${currentSize}px ${family}`;
    ctx.font = fontStr;

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length <= 4 || currentSize === minSize) {
      return { lines, fontSize: currentSize, fontStr };
    }

    currentSize -= 2;
  }

  const fontStr = `${weight} ${minSize}px ${family}`;
  return { lines: [text], fontSize: minSize, fontStr };
}

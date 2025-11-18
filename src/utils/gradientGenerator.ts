/**
 * Gradient generation utilities for creating beautiful gradients from color palettes
 */

import chroma from 'chroma-js';
import type { ColorShades } from '@/types';

/**
 * Gradient types available for generation
 */
export type GradientType = 'linear' | 'radial' | 'conic';

/**
 * Configuration for a gradient color stop
 */
export interface ColorStop {
  color: string;
  position: number; // 0-100
}

/**
 * Configuration for gradient generation
 */
export interface GradientConfig {
  type: GradientType;
  colors: ColorStop[];
  angle?: number; // for linear gradients (0-360)
  shape?: 'circle' | 'ellipse'; // for radial gradients
  startAngle?: number; // for conic gradients (0-360)
  centerX?: number; // for radial/conic (0-100)
  centerY?: number; // for radial/conic (0-100)
}

/**
 * Preset gradient configuration
 */
export interface GradientPreset {
  id: string;
  name: string;
  description: string;
  gradient: GradientConfig;
  cssValue: string;
  category: 'warm' | 'cool' | 'subtle' | 'bold' | 'creative';
}

/**
 * Generate a CSS linear gradient string
 * @param colors - Array of colors (hex values)
 * @param angle - Gradient angle in degrees (0-360)
 * @returns CSS gradient string
 */
export function generateLinearGradient(colors: string[], angle: number = 90): string {
  if (colors.length === 0) return '';
  if (colors.length === 1) return colors[0];

  const colorStops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `${color} ${position}%`;
    })
    .join(', ');

  return `linear-gradient(${angle}deg, ${colorStops})`;
}

/**
 * Generate a CSS radial gradient string
 * @param colors - Array of colors (hex values)
 * @param shape - Gradient shape ('circle' or 'ellipse')
 * @returns CSS gradient string
 */
export function generateRadialGradient(
  colors: string[],
  shape: 'circle' | 'ellipse' = 'circle'
): string {
  if (colors.length === 0) return '';
  if (colors.length === 1) return colors[0];

  const colorStops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `${color} ${position}%`;
    })
    .join(', ');

  return `radial-gradient(${shape}, ${colorStops})`;
}

/**
 * Generate a CSS conic gradient string
 * @param colors - Array of colors (hex values)
 * @param startAngle - Starting angle in degrees (0-360)
 * @returns CSS gradient string
 */
export function generateConicGradient(colors: string[], startAngle: number = 0): string {
  if (colors.length === 0) return '';
  if (colors.length === 1) return colors[0];

  const colorStops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 360;
      return `${color} ${position}deg`;
    })
    .join(', ');

  return `conic-gradient(from ${startAngle}deg, ${colorStops})`;
}

/**
 * Get CSS value for a gradient configuration
 * @param gradient - Gradient configuration
 * @returns CSS gradient string
 */
export function getGradientCSS(gradient: GradientConfig): string {
  const { type, colors, angle = 90, shape = 'circle', startAngle = 0, centerX = 50, centerY = 50 } = gradient;

  if (colors.length === 0) return '';

  // Sort colors by position
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  const colorStops = sortedColors.map(c => `${c.color} ${c.position}%`).join(', ');

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${colorStops})`;

    case 'radial': {
      const position = centerX !== 50 || centerY !== 50
        ? `${shape} at ${centerX}% ${centerY}%`
        : shape;
      return `radial-gradient(${position}, ${colorStops})`;
    }

    case 'conic': {
      const conicPosition = centerX !== 50 || centerY !== 50
        ? `from ${startAngle}deg at ${centerX}% ${centerY}%`
        : `from ${startAngle}deg`;
      return `conic-gradient(${conicPosition}, ${colorStops})`;
    }

    default:
      return '';
  }
}

/**
 * Generate smooth color transitions using chroma-js
 * @param startColor - Starting color
 * @param endColor - Ending color
 * @param steps - Number of intermediate colors
 * @returns Array of colors with smooth transition
 */
export function generateSmoothTransition(
  startColor: string,
  endColor: string,
  steps: number = 3
): string[] {
  if (steps <= 0) return [startColor, endColor];

  const scale = chroma.scale([startColor, endColor]).mode('lab');
  const colors: string[] = [];

  for (let i = 0; i <= steps + 1; i++) {
    colors.push(scale(i / (steps + 1)).hex());
  }

  return colors;
}

/**
 * Create preset gradients from color shades
 * @param shades - Color shades object
 * @param primaryColor - Primary color hex value
 * @returns Array of gradient presets
 */
export function createGradientPresets(shades: ColorShades, primaryColor: string): GradientPreset[] {
  const presets: GradientPreset[] = [];

  // Sunset - warm gradient from light to dark
  const sunsetGradient: GradientConfig = {
    type: 'linear',
    angle: 135,
    colors: [
      { color: shades[300], position: 0 },
      { color: shades[500], position: 35 },
      { color: shades[700], position: 65 },
      { color: shades[900], position: 100 }
    ]
  };

  presets.push({
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm transition from light to dark shades',
    gradient: sunsetGradient,
    cssValue: getGradientCSS(sunsetGradient),
    category: 'warm'
  });

  // Ocean - cool gradient with smooth transitions
  const oceanGradient: GradientConfig = {
    type: 'linear',
    angle: 180,
    colors: [
      { color: shades[100], position: 0 },
      { color: shades[300], position: 25 },
      { color: shades[500], position: 50 },
      { color: shades[600], position: 75 },
      { color: shades[800], position: 100 }
    ]
  };

  presets.push({
    id: 'ocean',
    name: 'Ocean Depth',
    description: 'Smooth transition mimicking ocean depths',
    gradient: oceanGradient,
    cssValue: getGradientCSS(oceanGradient),
    category: 'cool'
  });

  // Aurora - multiple colors with interesting angles
  const auroraGradient: GradientConfig = {
    type: 'linear',
    angle: 45,
    colors: [
      { color: shades[200], position: 0 },
      { color: shades[400], position: 20 },
      { color: shades[600], position: 40 },
      { color: shades[400], position: 60 },
      { color: shades[700], position: 80 },
      { color: shades[500], position: 100 }
    ]
  };

  presets.push({
    id: 'aurora',
    name: 'Aurora',
    description: 'Dynamic multi-color aurora effect',
    gradient: auroraGradient,
    cssValue: getGradientCSS(auroraGradient),
    category: 'creative'
  });

  // Subtle - adjacent shades for backgrounds
  const subtleGradient: GradientConfig = {
    type: 'linear',
    angle: 90,
    colors: [
      { color: shades[50], position: 0 },
      { color: shades[100], position: 50 },
      { color: shades[200], position: 100 }
    ]
  };

  presets.push({
    id: 'subtle',
    name: 'Subtle Background',
    description: 'Light gradient perfect for backgrounds',
    gradient: subtleGradient,
    cssValue: getGradientCSS(subtleGradient),
    category: 'subtle'
  });

  // Bold - high contrast combinations
  const boldGradient: GradientConfig = {
    type: 'linear',
    angle: 270,
    colors: [
      { color: shades[900], position: 0 },
      { color: shades[500], position: 50 },
      { color: shades[100], position: 100 }
    ]
  };

  presets.push({
    id: 'bold',
    name: 'Bold Impact',
    description: 'High contrast gradient for impact',
    gradient: boldGradient,
    cssValue: getGradientCSS(boldGradient),
    category: 'bold'
  });

  // Radial Glow
  const glowGradient: GradientConfig = {
    type: 'radial',
    shape: 'circle',
    colors: [
      { color: shades[300], position: 0 },
      { color: shades[500], position: 50 },
      { color: shades[800], position: 100 }
    ]
  };

  presets.push({
    id: 'glow',
    name: 'Radial Glow',
    description: 'Centered radial gradient with glow effect',
    gradient: glowGradient,
    cssValue: getGradientCSS(glowGradient),
    category: 'creative'
  });

  // Soft Focus
  const softFocusGradient: GradientConfig = {
    type: 'radial',
    shape: 'ellipse',
    centerX: 30,
    centerY: 30,
    colors: [
      { color: shades[200], position: 0 },
      { color: shades[400], position: 40 },
      { color: shades[600], position: 100 }
    ]
  };

  presets.push({
    id: 'soft-focus',
    name: 'Soft Focus',
    description: 'Off-center radial for depth',
    gradient: softFocusGradient,
    cssValue: getGradientCSS(softFocusGradient),
    category: 'subtle'
  });

  // Diagonal Strike
  const diagonalStrike: GradientConfig = {
    type: 'linear',
    angle: 45,
    colors: [
      { color: shades[100], position: 0 },
      { color: shades[100], position: 45 },
      { color: shades[700], position: 50 },
      { color: shades[700], position: 55 },
      { color: shades[100], position: 60 },
      { color: shades[100], position: 100 }
    ]
  };

  presets.push({
    id: 'diagonal-strike',
    name: 'Diagonal Strike',
    description: 'Sharp diagonal line pattern',
    gradient: diagonalStrike,
    cssValue: getGradientCSS(diagonalStrike),
    category: 'bold'
  });

  // Smooth Blend using chroma
  const smoothColors = generateSmoothTransition(shades[200], shades[800], 3);
  const smoothBlend: GradientConfig = {
    type: 'linear',
    angle: 120,
    colors: smoothColors.map((color, index) => ({
      color,
      position: (index / (smoothColors.length - 1)) * 100
    }))
  };

  presets.push({
    id: 'smooth-blend',
    name: 'Smooth Blend',
    description: 'Scientifically smooth color transition',
    gradient: smoothBlend,
    cssValue: getGradientCSS(smoothBlend),
    category: 'subtle'
  });

  // Complementary Split
  const complementaryColor = chroma(primaryColor).set('hsl.h', '+180').hex();
  const compGradient: GradientConfig = {
    type: 'linear',
    angle: 90,
    colors: [
      { color: primaryColor, position: 0 },
      { color: shades[500], position: 33 },
      { color: complementaryColor, position: 66 },
      { color: primaryColor, position: 100 }
    ]
  };

  presets.push({
    id: 'complementary-split',
    name: 'Complementary Split',
    description: 'Using complementary colors for contrast',
    gradient: compGradient,
    cssValue: getGradientCSS(compGradient),
    category: 'bold'
  });

  // Conic Rainbow
  const conicRainbow: GradientConfig = {
    type: 'conic',
    startAngle: 0,
    colors: [
      { color: shades[500], position: 0 },
      { color: shades[300], position: 90 },
      { color: shades[700], position: 180 },
      { color: shades[400], position: 270 },
      { color: shades[500], position: 360 }
    ]
  };

  presets.push({
    id: 'conic-rainbow',
    name: 'Color Wheel',
    description: 'Conic gradient creating a color wheel effect',
    gradient: conicRainbow,
    cssValue: getGradientCSS(conicRainbow),
    category: 'creative'
  });

  // Vintage Fade
  const vintageFade: GradientConfig = {
    type: 'radial',
    shape: 'ellipse',
    centerX: 50,
    centerY: 0,
    colors: [
      { color: chroma(shades[300]).alpha(0.8).css(), position: 0 },
      { color: shades[500], position: 50 },
      { color: chroma(shades[800]).darken(0.5).hex(), position: 100 }
    ]
  };

  presets.push({
    id: 'vintage-fade',
    name: 'Vintage Fade',
    description: 'Top-centered radial with vintage feel',
    gradient: vintageFade,
    cssValue: getGradientCSS(vintageFade),
    category: 'warm'
  });

  return presets;
}

/**
 * Export gradient as different code formats
 */
export function exportGradientCode(gradient: GradientConfig, format: 'css' | 'tailwind' | 'scss'): string {
  const cssValue = getGradientCSS(gradient);

  switch (format) {
    case 'css':
      return `background: ${cssValue};`;

    case 'tailwind': {
      // For Tailwind, we need to escape special characters
      const escapedGradient = cssValue.replace(/[(),%]/g, '\\$&');
      return `bg-[${escapedGradient}]`;
    }

    case 'scss':
      return `$gradient: ${cssValue};\nbackground: $gradient;`;

    default:
      return cssValue;
  }
}

/**
 * Generate gradient suggestions based on color theory
 */
export function suggestGradientCombinations(shades: ColorShades): ColorStop[][] {
  const suggestions: ColorStop[][] = [];

  // Monochromatic - same hue, different lightness
  suggestions.push([
    { color: shades[200], position: 0 },
    { color: shades[500], position: 50 },
    { color: shades[800], position: 100 }
  ]);

  // Light to medium
  suggestions.push([
    { color: shades[100], position: 0 },
    { color: shades[300], position: 33 },
    { color: shades[500], position: 66 },
    { color: shades[600], position: 100 }
  ]);

  // Dark to light to dark (symmetric)
  suggestions.push([
    { color: shades[700], position: 0 },
    { color: shades[300], position: 50 },
    { color: shades[700], position: 100 }
  ]);

  // Skip shades for contrast
  suggestions.push([
    { color: shades[100], position: 0 },
    { color: shades[500], position: 50 },
    { color: shades[900], position: 100 }
  ]);

  return suggestions;
}
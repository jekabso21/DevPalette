/**
 * Export formatter utilities for DevPalette
 * Converts color palettes to various professional formats
 */

import { ColorShades, ShadeLevel } from '../types';

// Shade levels in order for iteration
const SHADE_LEVELS: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * Formats color palette for Tailwind CSS configuration
 */
export function formatTailwind(shades: ColorShades, colorName: string): string {
  const colorObject = SHADE_LEVELS.reduce((acc, shade) => {
    acc[shade] = shades[shade];
    return acc;
  }, {} as Record<ShadeLevel, string>);

  const indentedColors = Object.entries(colorObject)
    .map(([shade, color]) => `          ${shade}: '${color}',`)
    .join('\n');

  return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${indentedColors}
        }
      }
    }
  }
}`;
}

/**
 * Formats color palette as CSS custom properties (CSS variables)
 */
export function formatCSS(shades: ColorShades, colorName: string): string {
  const cssVariables = SHADE_LEVELS
    .map(shade => `  --${colorName}-${shade}: ${shades[shade]};`)
    .join('\n');

  return `:root {
${cssVariables}
}`;
}

/**
 * Formats color palette for SCSS/SASS
 */
export function formatSCSS(shades: ColorShades, colorName: string): string {
  const scssVariables = SHADE_LEVELS
    .map(shade => `$${colorName}-${shade}: ${shades[shade]};`)
    .join('\n');

  return scssVariables;
}

/**
 * Formats color palette for JavaScript/TypeScript export
 */
export function formatJavaScript(shades: ColorShades, colorName: string): string {
  const colorObject = SHADE_LEVELS.reduce((acc, shade) => {
    acc[shade] = shades[shade];
    return acc;
  }, {} as Record<ShadeLevel, string>);

  const indentedColors = Object.entries(colorObject)
    .map(([shade, color]) => `    ${shade}: '${color}',`)
    .join('\n');

  return `export const colors = {
  ${colorName}: {
${indentedColors}
  }
};`;
}

/**
 * Formats color palette for Figma plugin
 */
export function formatFigma(shades: ColorShades, colorName: string): string {
  const figmaColors = SHADE_LEVELS.reduce((acc, shade) => {
    acc[`${colorName}/${shade}`] = shades[shade];
    return acc;
  }, {} as Record<string, string>);

  return JSON.stringify(figmaColors, null, 2);
}

/**
 * Gets the appropriate file extension for an export format
 */
export function getFileExtension(format: string): string {
  const extensions: Record<string, string> = {
    tailwind: 'config.js',
    css: 'css',
    scss: 'scss',
    javascript: 'ts',
    figma: 'json',
  };

  return extensions[format] || 'txt';
}

/**
 * Gets the appropriate MIME type for an export format
 */
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    tailwind: 'application/javascript',
    css: 'text/css',
    scss: 'text/x-scss',
    javascript: 'application/typescript',
    figma: 'application/json',
  };

  return mimeTypes[format] || 'text/plain';
}

/**
 * Generates a filename for the export
 */
export function generateFilename(format: string, colorName: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = getFileExtension(format);
  const sanitizedColorName = colorName.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();

  if (format === 'tailwind') {
    return `tailwind.${sanitizedColorName}.${extension}`;
  }

  return `${sanitizedColorName}-palette-${timestamp}.${extension}`;
}
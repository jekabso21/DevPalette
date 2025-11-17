/**
 * Semantic color naming utilities
 * Suggests appropriate semantic names based on color hue
 */

import { hexToHsl } from './colorHelpers';

/**
 * Color hue ranges for semantic naming
 */
const HUE_RANGES = {
  red: { min: 345, max: 15 },       // Wraps around 0
  orange: { min: 15, max: 45 },
  yellow: { min: 45, max: 65 },
  lime: { min: 65, max: 90 },
  green: { min: 90, max: 150 },
  cyan: { min: 150, max: 195 },
  blue: { min: 195, max: 255 },
  purple: { min: 255, max: 285 },
  pink: { min: 285, max: 345 },
} as const;

/**
 * Semantic name suggestions by hue category
 */
const SEMANTIC_NAMES: Record<string, string[]> = {
  red: ['danger', 'error', 'destructive', 'alert', 'negative'],
  orange: ['warning', 'caution', 'attention', 'alert', 'notice'],
  yellow: ['warning', 'caution', 'attention', 'highlight', 'accent'],
  lime: ['lime', 'accent', 'highlight', 'fresh', 'active'],
  green: ['success', 'positive', 'safe', 'confirmed', 'complete'],
  cyan: ['info', 'information', 'notification', 'accent', 'fresh'],
  blue: ['primary', 'brand', 'info', 'link', 'action'],
  purple: ['accent', 'premium', 'creative', 'brand', 'feature'],
  pink: ['accent', 'creative', 'brand', 'highlight', 'feature'],
  gray: ['neutral', 'muted', 'secondary', 'base', 'slate'],
};

/**
 * Determines if a hue is within a given range
 * Handles the special case of red which wraps around 0/360
 */
function isHueInRange(hue: number, range: { min: number; max: number }): boolean {
  if (range.min > range.max) {
    // Handles red range that wraps around
    return hue >= range.min || hue <= range.max;
  }
  return hue >= range.min && hue <= range.max;
}

/**
 * Gets the color category based on hue
 */
function getColorCategory(hue: number): string {
  // Special case for gray/neutral colors (low saturation)
  // This will be checked by the caller

  for (const [category, range] of Object.entries(HUE_RANGES)) {
    if (isHueInRange(hue, range)) {
      return category;
    }
  }

  return 'neutral'; // Default fallback
}

/**
 * Suggests semantic color names based on the hex color
 * @param hexColor - The hex color value to analyze
 * @returns Array of suggested semantic names
 */
export function suggestColorName(hexColor: string): string[] {
  try {
    const hsl = hexToHsl(hexColor);

    // Parse HSL values
    const matches = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!matches) {
      return ['primary', 'brand', 'accent'];
    }

    const hue = parseInt(matches[1], 10);
    const saturation = parseInt(matches[2], 10);
    const lightness = parseInt(matches[3], 10);

    // Check for gray/neutral colors (low saturation or very light/dark)
    if (saturation < 15 || lightness > 95 || lightness < 5) {
      return SEMANTIC_NAMES.gray;
    }

    // Get category based on hue
    const category = getColorCategory(hue);

    // Return semantic names for the category
    return SEMANTIC_NAMES[category] || ['primary', 'brand', 'accent'];
  } catch (error) {
    // Fallback to generic names if color parsing fails
    return ['primary', 'brand', 'accent'];
  }
}

/**
 * Gets a default name based on the first suggested semantic name
 */
export function getDefaultColorName(hexColor: string): string {
  const suggestions = suggestColorName(hexColor);
  return suggestions[0] || 'primary';
}

/**
 * Validates if a color name is valid for use in code
 * (alphanumeric, hyphens, and underscores only)
 */
export function isValidColorName(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name);
}

/**
 * Sanitizes a color name to be valid for use in code
 */
export function sanitizeColorName(name: string): string {
  // Remove invalid characters and ensure it starts with a letter
  let sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '');

  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(sanitized)) {
    sanitized = 'color' + sanitized;
  }

  // Default to 'primary' if empty
  return sanitized || 'primary';
}

/**
 * Formats a color name for display (Title Case)
 */
export function formatColorNameForDisplay(name: string): string {
  return name
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
import chroma from 'chroma-js';
import type { ColorFormat, ColorValue, ColorValidationResult } from '@/types';

/**
 * Validate a color string and determine its format
 *
 * @param color - Color string to validate
 * @returns Validation result with format and normalized value
 */
export function validateColor(color: string): ColorValidationResult {
  if (!color || typeof color !== 'string') {
    return {
      isValid: false,
      format: null,
      normalizedValue: null,
      error: 'Invalid color value provided',
    };
  }

  const trimmedColor = color.trim();

  // Check for hex format
  if (trimmedColor.startsWith('#')) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(trimmedColor)) {
      return {
        isValid: true,
        format: 'hex',
        normalizedValue: normalizeHexColor(trimmedColor),
      };
    }
  }

  // Check for rgb/rgba format
  if (trimmedColor.startsWith('rgb')) {
    try {
      const chromaColor = chroma(trimmedColor);
      return {
        isValid: true,
        format: 'rgb',
        normalizedValue: chromaColor.css(),
      };
    } catch {
      // Invalid RGB format
    }
  }

  // Check for hsl/hsla format
  if (trimmedColor.startsWith('hsl')) {
    try {
      const chromaColor = chroma(trimmedColor);
      return {
        isValid: true,
        format: 'hsl',
        normalizedValue: chromaColor.css('hsl'),
      };
    } catch {
      // Invalid HSL format
    }
  }

  // Try to parse as a named color or other format
  try {
    const chromaColor = chroma(trimmedColor);
    return {
      isValid: true,
      format: 'hex', // Default to hex for named colors
      normalizedValue: chromaColor.hex(),
    };
  } catch {
    return {
      isValid: false,
      format: null,
      normalizedValue: null,
      error: `Invalid color format: ${trimmedColor}`,
    };
  }
}

/**
 * Normalize a hex color to 6-digit format
 *
 * @param hex - Hex color string
 * @returns Normalized 6-digit hex color
 */
export function normalizeHexColor(hex: string): string {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length === 3) {
    // Convert 3-digit hex to 6-digit
    return `#${cleanHex
      .split('')
      .map(char => char + char)
      .join('')}`.toUpperCase();
  }

  return `#${cleanHex}`.toUpperCase();
}

/**
 * Convert a color to different formats
 *
 * @param color - Input color in any format
 * @returns Object with color in multiple formats
 */
export function convertColor(color: string): ColorValue | null {
  try {
    const chromaColor = chroma(color);

    return {
      hex: chromaColor.hex(),
      rgb: chromaColor.css(),
      hsl: chromaColor.css('hsl'),
    };
  } catch (error) {
    console.error('Error converting color:', error);
    return null;
  }
}

/**
 * Get RGB values as an object
 *
 * @param color - Input color
 * @returns Object with r, g, b values
 */
export function getRGBValues(color: string): { r: number; g: number; b: number } | null {
  try {
    const [r, g, b] = chroma(color).rgb();
    return { r, g, b };
  } catch {
    return null;
  }
}

/**
 * Get HSL values as an object
 *
 * @param color - Input color
 * @returns Object with h, s, l values
 */
export function getHSLValues(color: string): { h: number; s: number; l: number } | null {
  try {
    const [h, s, l] = chroma(color).hsl();
    return {
      h: isNaN(h) ? 0 : Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  } catch {
    return null;
  }
}

/**
 * Format RGB values as a CSS string
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns CSS RGB string
 */
export function formatRGB(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/**
 * Format HSL values as a CSS string
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns CSS HSL string
 */
export function formatHSL(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/**
 * Calculate color contrast ratio between two colors
 *
 * @param color1 - First color
 * @param color2 - Second color
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    return chroma.contrast(color1, color2);
  } catch {
    return 1;
  }
}

/**
 * Check if two colors meet WCAG AA contrast requirements
 *
 * @param foreground - Foreground color
 * @param background - Background color
 * @param largeText - Whether the text is large (14pt+ bold or 18pt+)
 * @returns true if contrast meets AA requirements
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if two colors meet WCAG AAA contrast requirements
 *
 * @param foreground - Foreground color
 * @param background - Background color
 * @param largeText - Whether the text is large
 * @returns true if contrast meets AAA requirements
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Get the relative luminance of a color
 *
 * @param color - Input color
 * @returns Luminance value (0-1)
 */
export function getLuminance(color: string): number {
  try {
    return chroma(color).luminance();
  } catch {
    return 0.5;
  }
}

/**
 * Adjust color brightness
 *
 * @param color - Input color
 * @param amount - Amount to brighten (positive) or darken (negative)
 * @returns Adjusted color
 */
export function adjustBrightness(color: string, amount: number): string {
  try {
    return chroma(color).brighten(amount).hex();
  } catch {
    return color;
  }
}

/**
 * Adjust color saturation
 *
 * @param color - Input color
 * @param amount - Amount to saturate (positive) or desaturate (negative)
 * @returns Adjusted color
 */
export function adjustSaturation(color: string, amount: number): string {
  try {
    return amount >= 0
      ? chroma(color).saturate(amount).hex()
      : chroma(color).desaturate(Math.abs(amount)).hex();
  } catch {
    return color;
  }
}

/**
 * Generate a random color
 *
 * @param options - Options for random color generation
 * @returns Random color in hex format
 */
export function randomColor(options?: {
  luminosity?: 'bright' | 'light' | 'dark';
  format?: ColorFormat;
}): string {
  const { luminosity = 'bright', format = 'hex' } = options || {};

  let color: chroma.Color;

  switch (luminosity) {
    case 'bright':
      color = chroma.random();
      break;
    case 'light':
      color = chroma.hsl(Math.random() * 360, 0.7 + Math.random() * 0.3, 0.7 + Math.random() * 0.3);
      break;
    case 'dark':
      color = chroma.hsl(Math.random() * 360, 0.5 + Math.random() * 0.5, 0.2 + Math.random() * 0.3);
      break;
    default:
      color = chroma.random();
  }

  switch (format) {
    case 'rgb':
      return color.css();
    case 'hsl':
      return color.css('hsl');
    default:
      return color.hex();
  }
}

/**
 * Interpolate between two colors
 *
 * @param color1 - Start color
 * @param color2 - End color
 * @param steps - Number of steps
 * @returns Array of interpolated colors
 */
export function interpolateColors(color1: string, color2: string, steps: number = 5): string[] {
  try {
    const scale = chroma.scale([color1, color2]).mode('lab');
    const colors: string[] = [];

    for (let i = 0; i <= steps; i++) {
      colors.push(scale(i / steps).hex());
    }

    return colors;
  } catch {
    return [color1, color2];
  }
}

/**
 * Check if a color is valid
 *
 * @param color - Color to check
 * @returns true if valid
 */
export function isValidColor(color: string): boolean {
  return validateColor(color).isValid;
}

/**
 * Get complementary color
 *
 * @param color - Input color
 * @returns Complementary color in hex format
 */
export function getComplementaryColor(color: string): string {
  try {
    const [h, s, l] = chroma(color).hsl();
    const complementaryHue = (h + 180) % 360;
    return chroma.hsl(complementaryHue, s, l).hex();
  } catch {
    return '#000000';
  }
}

/**
 * Get analogous colors
 *
 * @param color - Input color
 * @param angle - Angle between colors (default 30)
 * @returns Array of analogous colors
 */
export function getAnalogousColors(color: string, angle: number = 30): string[] {
  try {
    const [h, s, l] = chroma(color).hsl();
    return [
      chroma.hsl((h - angle + 360) % 360, s, l).hex(),
      color,
      chroma.hsl((h + angle) % 360, s, l).hex(),
    ];
  } catch {
    return [color];
  }
}

/**
 * Get triadic colors
 *
 * @param color - Input color
 * @returns Array of triadic colors
 */
export function getTriadicColors(color: string): string[] {
  try {
    const [h, s, l] = chroma(color).hsl();
    return [
      color,
      chroma.hsl((h + 120) % 360, s, l).hex(),
      chroma.hsl((h + 240) % 360, s, l).hex(),
    ];
  } catch {
    return [color];
  }
}

/**
 * Get tetradic colors
 *
 * @param color - Input color
 * @returns Array of tetradic colors
 */
export function getTetradicColors(color: string): string[] {
  try {
    const [h, s, l] = chroma(color).hsl();
    return [
      color,
      chroma.hsl((h + 90) % 360, s, l).hex(),
      chroma.hsl((h + 180) % 360, s, l).hex(),
      chroma.hsl((h + 270) % 360, s, l).hex(),
    ];
  } catch {
    return [color];
  }
}

/**
 * Determine if text should be light or dark based on background color
 *
 * @param backgroundColor - Background color to check
 * @returns 'light' or 'dark' text color
 */
export function getContrastTextColor(backgroundColor: string): 'light' | 'dark' {
  try {
    const luminance = getLuminance(backgroundColor);
    return luminance > 0.5 ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Check if a color is considered light based on its luminance
 *
 * @param color - The hex color string
 * @returns True if the color is light
 */
export function isLightShade(color: string): boolean {
  try {
    // Use chroma to calculate luminance
    const luminance = chroma(color).luminance();
    // Colors with luminance > 0.5 are considered light
    return luminance > 0.5;
  } catch {
    // Default to false if color is invalid
    return false;
  }
}
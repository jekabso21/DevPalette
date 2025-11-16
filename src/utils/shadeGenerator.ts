import chroma from 'chroma-js';
import type { ColorShades, ShadeLevel, ShadeGenerationOptions } from '@/types';

/**
 * Generate a complete set of color shades (50-900) from a primary color
 * Using HSL color space for accurate lightness adjustments
 *
 * @param primaryColor - The primary color (will be used as shade 500)
 * @param options - Optional configuration for shade generation
 * @returns ColorShades object with all shade levels
 */
export function generateShades(
  primaryColor: string,
  options: ShadeGenerationOptions = {}
): ColorShades {
  const {
    preserveHue = true,
    saturationAdjustment = true,
  } = options;

  try {
    // Validate and create chroma color instance
    const baseColor = chroma(primaryColor);

    // Get HSL values for manipulation
    const [hue, saturation, lightness] = baseColor.hsl();

    // Define lightness values for each shade
    // These are carefully tuned for optimal visual hierarchy
    const lightnessMap: Record<ShadeLevel, number> = {
      50: 0.97,   // Very light - almost white
      100: 0.93,  // Light background
      200: 0.86,  // Light accent
      300: 0.74,  // Medium light
      400: 0.62,  // Medium
      500: lightness, // Original color (primary)
      600: Math.max(lightness * 0.85, 0.35), // Slightly darker
      700: Math.max(lightness * 0.70, 0.25), // Dark
      800: Math.max(lightness * 0.55, 0.15), // Very dark
      900: Math.max(lightness * 0.35, 0.08), // Almost black
    };

    // Define saturation adjustments for each shade
    // Lighter shades have reduced saturation, darker shades have increased saturation
    const saturationMap: Record<ShadeLevel, number> = {
      50: saturation * 0.12,  // Very desaturated
      100: saturation * 0.24, // Desaturated
      200: saturation * 0.48, // Moderately desaturated
      300: saturation * 0.72, // Slightly desaturated
      400: saturation * 0.90, // Near original
      500: saturation,        // Original saturation
      600: Math.min(saturation * 1.05, 1), // Slightly more saturated
      700: Math.min(saturation * 1.10, 1), // More saturated
      800: Math.min(saturation * 1.15, 1), // Even more saturated
      900: Math.min(saturation * 1.20, 1), // Maximum saturation
    };

    // Generate shades
    const shades: ColorShades = {} as ColorShades;
    const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (const level of shadeLevels) {
      if (level === 500) {
        // Keep the original color for 500
        shades[level] = baseColor.hex();
      } else {
        // Calculate new HSL values
        const newHue = preserveHue ? hue : hue + (level < 500 ? -2 : 2); // Slight hue shift for variety
        const newSaturation = saturationAdjustment
          ? saturationMap[level]
          : saturation;
        const newLightness = lightnessMap[level];

        // Create the new color
        // Handle undefined hue (grayscale colors)
        const finalHue = isNaN(newHue) ? 0 : newHue;
        const finalSaturation = isNaN(newSaturation) ? 0 : newSaturation;

        shades[level] = chroma.hsl(
          finalHue,
          finalSaturation,
          newLightness
        ).hex();
      }
    }

    return shades;
  } catch (error) {
    // Fallback to a default gray scale if color parsing fails
    console.error('Error generating shades:', error);
    return generateGrayScale();
  }
}

/**
 * Generate shades using mix method (alternative approach)
 * Mixes the primary color with white/black for lighter/darker shades
 *
 * @param primaryColor - The primary color
 * @returns ColorShades object
 */
export function generateShadesMix(primaryColor: string): ColorShades {
  try {
    const baseColor = chroma(primaryColor);

    // Mix ratios for each shade level
    const mixRatios = {
      50: 0.92,  // 92% white
      100: 0.80, // 80% white
      200: 0.60, // 60% white
      300: 0.40, // 40% white
      400: 0.20, // 20% white
      500: 0,    // Original color
      600: 0.15, // 15% black
      700: 0.30, // 30% black
      800: 0.50, // 50% black
      900: 0.70, // 70% black
    };

    const shades: ColorShades = {} as ColorShades;
    const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (const level of shadeLevels) {
      if (level === 500) {
        shades[level] = baseColor.hex();
      } else if (level < 500) {
        // Mix with white for lighter shades
        shades[level] = chroma.mix('#ffffff', baseColor, 1 - mixRatios[level]).hex();
      } else {
        // Mix with black for darker shades
        shades[level] = chroma.mix(baseColor, '#000000', mixRatios[level]).hex();
      }
    }

    return shades;
  } catch (error) {
    console.error('Error generating shades with mix method:', error);
    return generateGrayScale();
  }
}

/**
 * Generate a default gray scale as fallback
 *
 * @returns ColorShades object with gray scale
 */
function generateGrayScale(): ColorShades {
  return {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  };
}

/**
 * Generate tints (lighter variations) of a color
 *
 * @param color - Base color
 * @param steps - Number of tints to generate
 * @returns Array of tinted colors
 */
export function generateTints(color: string, steps: number = 5): string[] {
  try {
    const baseColor = chroma(color);
    const tints: string[] = [];

    for (let i = 1; i <= steps; i++) {
      const ratio = i / (steps + 1);
      tints.push(chroma.mix(baseColor, '#ffffff', ratio).hex());
    }

    return tints;
  } catch (error) {
    console.error('Error generating tints:', error);
    return [];
  }
}

/**
 * Generate shades (darker variations) of a color
 *
 * @param color - Base color
 * @param steps - Number of shades to generate
 * @returns Array of shaded colors
 */
export function generateDarkShades(color: string, steps: number = 5): string[] {
  try {
    const baseColor = chroma(color);
    const shades: string[] = [];

    for (let i = 1; i <= steps; i++) {
      const ratio = i / (steps + 1);
      shades.push(chroma.mix(baseColor, '#000000', ratio).hex());
    }

    return shades;
  } catch (error) {
    console.error('Error generating dark shades:', error);
    return [];
  }
}

/**
 * Generate a monochromatic color scheme
 *
 * @param baseColor - The base color
 * @returns Array of colors in the scheme
 */
export function generateMonochromatic(baseColor: string): string[] {
  try {
    const color = chroma(baseColor);
    const [h, s, l] = color.hsl();

    return [
      chroma.hsl(h, s * 0.5, Math.min(l + 0.3, 0.95)).hex(),
      chroma.hsl(h, s * 0.75, Math.min(l + 0.15, 0.90)).hex(),
      color.hex(),
      chroma.hsl(h, s, Math.max(l - 0.15, 0.10)).hex(),
      chroma.hsl(h, s * 1.2, Math.max(l - 0.3, 0.05)).hex(),
    ];
  } catch (error) {
    console.error('Error generating monochromatic scheme:', error);
    return [baseColor];
  }
}

/**
 * Check if a shade level is light (for text contrast)
 *
 * @param color - Color to check
 * @returns true if the color is light
 */
export function isLightShade(color: string): boolean {
  try {
    return chroma(color).luminance() > 0.5;
  } catch {
    return true; // Default to light if parsing fails
  }
}

/**
 * Get the best text color (black or white) for a background
 *
 * @param backgroundColor - The background color
 * @returns '#000000' or '#ffffff' for best contrast
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightShade(backgroundColor) ? '#000000' : '#ffffff';
}
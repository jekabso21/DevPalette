import chroma from 'chroma-js';
import {
  getAnalogousColors,
  getComplementaryColor,
  getTriadicColors,
  getTetradicColors,
} from './colorHelpers';
import { generateShades } from './shadeGenerator';
import type { PaletteType, ColorPalette } from '@/types';

/**
 * Generate split-complementary colors
 * Base color + two colors adjacent to its complement
 *
 * @param color - Input color in hex format
 * @returns Array of 3 colors
 */
export function getSplitComplementaryColors(color: string): string[] {
  try {
    const [h, s, l] = chroma(color).hsl();
    const complementaryHue = (h + 180) % 360;

    return [
      color,
      chroma.hsl((complementaryHue - 30 + 360) % 360, s, l).hex(),
      chroma.hsl((complementaryHue + 30) % 360, s, l).hex(),
    ];
  } catch {
    return [color, '#000000', '#000000'];
  }
}

/**
 * Generate a complete monochromatic palette
 *
 * @param color - Base color
 * @returns ColorPalette with monochromatic scheme
 */
export function generateMonochromatic(color: string): ColorPalette {
  const shades = generateShades(color);

  return {
    type: 'monochromatic',
    name: 'Monochromatic',
    description: 'Different shades and tints of the same color',
    colors: Object.values(shades),
    shades: [shades],
  };
}

/**
 * Generate an analogous color palette
 *
 * @param color - Base color
 * @returns ColorPalette with analogous scheme
 */
export function generateAnalogous(color: string): ColorPalette {
  const colors = getAnalogousColors(color, 30);

  return {
    type: 'analogous',
    name: 'Analogous',
    description: 'Colors adjacent on the color wheel',
    colors,
    shades: colors.map(c => generateShades(c)),
  };
}

/**
 * Generate a complementary color palette
 *
 * @param color - Base color
 * @returns ColorPalette with complementary scheme
 */
export function generateComplementary(color: string): ColorPalette {
  const complementary = getComplementaryColor(color);
  const colors = [color, complementary];

  return {
    type: 'complementary',
    name: 'Complementary',
    description: 'Opposite colors on the color wheel',
    colors,
    shades: colors.map(c => generateShades(c)),
  };
}

/**
 * Generate a triadic color palette
 *
 * @param color - Base color
 * @returns ColorPalette with triadic scheme
 */
export function generateTriadic(color: string): ColorPalette {
  const colors = getTriadicColors(color);

  return {
    type: 'triadic',
    name: 'Triadic',
    description: 'Three colors evenly spaced on the color wheel',
    colors,
    shades: colors.map(c => generateShades(c)),
  };
}

/**
 * Generate a split-complementary color palette
 *
 * @param color - Base color
 * @returns ColorPalette with split-complementary scheme
 */
export function generateSplitComplementary(color: string): ColorPalette {
  const colors = getSplitComplementaryColors(color);

  return {
    type: 'split-complementary',
    name: 'Split Complementary',
    description: 'Base color and two colors adjacent to its complement',
    colors,
    shades: colors.map(c => generateShades(c)),
  };
}

/**
 * Generate a tetradic (square) color palette
 *
 * @param color - Base color
 * @returns ColorPalette with tetradic scheme
 */
export function generateTetradic(color: string): ColorPalette {
  const colors = getTetradicColors(color);

  return {
    type: 'tetradic',
    name: 'Tetradic',
    description: 'Four colors forming a square on the color wheel',
    colors,
    shades: colors.map(c => generateShades(c)),
  };
}

/**
 * Generate all color palettes for a given color
 *
 * @param color - Base color
 * @returns Object with all palette types
 */
export function generateAllPalettes(color: string): Record<PaletteType, ColorPalette> {
  return {
    monochromatic: generateMonochromatic(color),
    analogous: generateAnalogous(color),
    complementary: generateComplementary(color),
    triadic: generateTriadic(color),
    'split-complementary': generateSplitComplementary(color),
    tetradic: generateTetradic(color),
  };
}

/**
 * Get a specific palette by type
 *
 * @param color - Base color
 * @param type - Palette type
 * @returns ColorPalette of the specified type
 */
export function getPaletteByType(color: string, type: PaletteType): ColorPalette {
  switch (type) {
    case 'monochromatic':
      return generateMonochromatic(color);
    case 'analogous':
      return generateAnalogous(color);
    case 'complementary':
      return generateComplementary(color);
    case 'triadic':
      return generateTriadic(color);
    case 'split-complementary':
      return generateSplitComplementary(color);
    case 'tetradic':
      return generateTetradic(color);
    default:
      return generateMonochromatic(color);
  }
}
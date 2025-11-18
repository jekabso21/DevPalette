/**
 * Color blindness simulation utilities
 * Implements accurate color vision deficiency simulations using transformation matrices
 */

import chroma from 'chroma-js';
import type { ColorShades, ShadeLevel } from '@/types';

// Color blindness types
export type ColorBlindnessType =
  | 'protanopia'     // Red-blind (L-cone absent)
  | 'protanomaly'    // Red-weak (L-cone deficient)
  | 'deuteranopia'   // Green-blind (M-cone absent)
  | 'deuteranomaly'  // Green-weak (M-cone deficient)
  | 'tritanopia'     // Blue-blind (S-cone absent)
  | 'tritanomaly'    // Blue-weak (S-cone deficient)
  | 'achromatopsia'  // Total color blindness (no cones working)
  | 'achromatomaly'; // Partial color blindness (all cones deficient)

// Color blindness information
export interface ColorBlindnessInfo {
  type: ColorBlindnessType;
  name: string;
  description: string;
  prevalence: string;
  category: 'red-green' | 'blue-yellow' | 'complete';
}

// Transformation matrices for different types of color blindness
// Based on research by Brettel, Viénot and Mollon (1997) and Machado et al. (2009)
const COLOR_BLINDNESS_MATRICES: Record<ColorBlindnessType, number[][]> = {
  // Protanopia - Missing L (red) cones
  protanopia: [
    [0.567, 0.433, 0.000],
    [0.558, 0.442, 0.000],
    [0.000, 0.242, 0.758],
  ],

  // Protanomaly - Deficient L (red) cones
  protanomaly: [
    [0.817, 0.183, 0.000],
    [0.333, 0.667, 0.000],
    [0.000, 0.125, 0.875],
  ],

  // Deuteranopia - Missing M (green) cones
  deuteranopia: [
    [0.625, 0.375, 0.000],
    [0.700, 0.300, 0.000],
    [0.000, 0.300, 0.700],
  ],

  // Deuteranomaly - Deficient M (green) cones
  deuteranomaly: [
    [0.800, 0.200, 0.000],
    [0.258, 0.742, 0.000],
    [0.000, 0.142, 0.858],
  ],

  // Tritanopia - Missing S (blue) cones
  tritanopia: [
    [0.950, 0.050, 0.000],
    [0.000, 0.433, 0.567],
    [0.000, 0.475, 0.525],
  ],

  // Tritanomaly - Deficient S (blue) cones
  tritanomaly: [
    [0.967, 0.033, 0.000],
    [0.000, 0.733, 0.267],
    [0.000, 0.183, 0.817],
  ],

  // Achromatopsia - Complete color blindness
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],

  // Achromatomaly - Partial color blindness
  achromatomaly: [
    [0.618, 0.320, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.320, 0.516],
  ],
};

// Information about each type of color blindness
export const COLOR_BLINDNESS_INFO: Record<ColorBlindnessType, ColorBlindnessInfo> = {
  protanopia: {
    type: 'protanopia',
    name: 'Protanopia',
    description: 'Complete absence of red cone cells. Difficulty distinguishing between red and green colors.',
    prevalence: '1.3% of males, 0.02% of females',
    category: 'red-green',
  },
  protanomaly: {
    type: 'protanomaly',
    name: 'Protanomaly',
    description: 'Reduced sensitivity of red cone cells. Red colors appear weaker.',
    prevalence: '1.3% of males, 0.02% of females',
    category: 'red-green',
  },
  deuteranopia: {
    type: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Complete absence of green cone cells. Difficulty distinguishing between red and green colors.',
    prevalence: '1.2% of males, 0.01% of females',
    category: 'red-green',
  },
  deuteranomaly: {
    type: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: 'Reduced sensitivity of green cone cells. Most common type of color blindness.',
    prevalence: '5% of males, 0.35% of females',
    category: 'red-green',
  },
  tritanopia: {
    type: 'tritanopia',
    name: 'Tritanopia',
    description: 'Complete absence of blue cone cells. Difficulty distinguishing between blue and yellow colors.',
    prevalence: '0.001% of population',
    category: 'blue-yellow',
  },
  tritanomaly: {
    type: 'tritanomaly',
    name: 'Tritanomaly',
    description: 'Reduced sensitivity of blue cone cells. Very rare form of color blindness.',
    prevalence: '0.01% of population',
    category: 'blue-yellow',
  },
  achromatopsia: {
    type: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'Complete color blindness. Vision in shades of gray only.',
    prevalence: '0.003% of population',
    category: 'complete',
  },
  achromatomaly: {
    type: 'achromatomaly',
    name: 'Achromatomaly',
    description: 'Partial color blindness. Severely reduced color discrimination.',
    prevalence: 'Extremely rare',
    category: 'complete',
  },
};

/**
 * Apply transformation matrix to RGB values
 * @param rgb - RGB values [0-255]
 * @param matrix - 3x3 transformation matrix
 * @returns Transformed RGB values [0-255]
 */
function applyColorMatrix(rgb: number[], matrix: number[][]): number[] {
  const [r, g, b] = rgb;

  // Apply matrix transformation
  const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

  // Clamp values to 0-255 range
  return [
    Math.max(0, Math.min(255, Math.round(newR))),
    Math.max(0, Math.min(255, Math.round(newG))),
    Math.max(0, Math.min(255, Math.round(newB))),
  ];
}

/**
 * Convert RGB to linear RGB (remove gamma correction)
 * @param value - RGB channel value [0-255]
 * @returns Linear RGB value [0-255]
 */
function linearizeRGB(value: number): number {
  const normalized = value / 255;
  if (normalized <= 0.04045) {
    return (normalized / 12.92) * 255;
  }
  return Math.pow((normalized + 0.055) / 1.055, 2.4) * 255;
}

/**
 * Convert linear RGB back to sRGB (apply gamma correction)
 * @param value - Linear RGB channel value [0-255]
 * @returns sRGB value [0-255]
 */
function delinearizeRGB(value: number): number {
  const normalized = value / 255;
  if (normalized <= 0.0031308) {
    return (normalized * 12.92) * 255;
  }
  return (1.055 * Math.pow(normalized, 1 / 2.4) - 0.055) * 255;
}

/**
 * Simulate how a color appears to someone with color blindness
 * @param color - Input color in any format
 * @param type - Type of color blindness to simulate
 * @returns Simulated color as hex string
 */
export function simulateColorBlindness(color: string, type: ColorBlindnessType): string {
  try {
    // Parse color and get RGB values
    const chromaColor = chroma(color);
    const [r, g, b] = chromaColor.rgb();

    // Linearize RGB values for accurate transformation
    const linearRGB = [
      linearizeRGB(r),
      linearizeRGB(g),
      linearizeRGB(b),
    ];

    // Apply color blindness transformation
    const matrix = COLOR_BLINDNESS_MATRICES[type];
    const transformedLinear = applyColorMatrix(linearRGB, matrix);

    // Convert back to sRGB
    const transformedRGB = transformedLinear.map(delinearizeRGB);

    // Create new color and return as hex
    return chroma(transformedRGB, 'rgb').hex();
  } catch (error) {
    console.error('Error simulating color blindness:', error);
    return color; // Return original color on error
  }
}

/**
 * Simulate color blindness for an entire palette
 * @param shades - Original color shades
 * @param type - Type of color blindness to simulate
 * @returns Simulated color shades
 */
export function simulatePaletteForColorBlindness(
  shades: ColorShades,
  type: ColorBlindnessType
): ColorShades {
  const simulatedShades: Partial<ColorShades> = {};
  const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  for (const level of shadeLevels) {
    simulatedShades[level] = simulateColorBlindness(shades[level], type);
  }

  return simulatedShades as ColorShades;
}

/**
 * Check if two colors are distinguishable for a specific type of color blindness
 * @param color1 - First color
 * @param color2 - Second color
 * @param type - Type of color blindness
 * @param threshold - Minimum delta E for colors to be considered distinguishable (default: 10)
 * @returns Whether the colors are distinguishable
 */
export function areColorsDistinguishable(
  color1: string,
  color2: string,
  type: ColorBlindnessType,
  threshold: number = 10
): boolean {
  try {
    const simulated1 = simulateColorBlindness(color1, type);
    const simulated2 = simulateColorBlindness(color2, type);

    // Calculate perceptual difference using Delta E 2000
    const deltaE = chroma.deltaE(simulated1, simulated2);

    return deltaE >= threshold;
  } catch (error) {
    console.error('Error checking color distinguishability:', error);
    return false;
  }
}

/**
 * Analyze how well a palette works for different types of color blindness
 * @param shades - Color shades to analyze
 * @returns Analysis results for each type of color blindness
 */
export function analyzePaletteAccessibility(shades: ColorShades): Record<ColorBlindnessType, {
  distinguishablePercentage: number;
  problematicPairs: Array<{ shade1: string; shade2: string }>;
  severity: 'good' | 'moderate' | 'poor';
}> {
  const results: Record<ColorBlindnessType, {
    distinguishablePercentage: number;
    problematicPairs: Array<{ shade1: string; shade2: string }>;
    severity: 'good' | 'moderate' | 'poor';
  }> = {} as Record<ColorBlindnessType, {
    distinguishablePercentage: number;
    problematicPairs: Array<{ shade1: string; shade2: string }>;
    severity: 'good' | 'moderate' | 'poor';
  }>;
  const types: ColorBlindnessType[] = [
    'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly',
    'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly',
  ];

  const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  for (const type of types) {
    let distinguishableCount = 0;
    let totalPairs = 0;
    const problematicPairs: Array<{ shade1: string; shade2: string }> = [];

    // Check all shade pairs
    for (let i = 0; i < shadeLevels.length; i++) {
      for (let j = i + 1; j < shadeLevels.length; j++) {
        const shade1 = shadeLevels[i];
        const shade2 = shadeLevels[j];

        totalPairs++;

        if (areColorsDistinguishable(shades[shade1], shades[shade2], type)) {
          distinguishableCount++;
        } else {
          problematicPairs.push({
            shade1: shade1.toString(),
            shade2: shade2.toString(),
          });
        }
      }
    }

    const percentage = (distinguishableCount / totalPairs) * 100;
    let severity: 'good' | 'moderate' | 'poor';

    if (percentage >= 80) {
      severity = 'good';
    } else if (percentage >= 60) {
      severity = 'moderate';
    } else {
      severity = 'poor';
    }

    results[type] = {
      distinguishablePercentage: percentage,
      problematicPairs: problematicPairs.slice(0, 5), // Limit to top 5 problematic pairs
      severity,
    };
  }

  return results;
}

/**
 * Get recommended adjustments for better color blindness accessibility
 * @param shades - Color shades to analyze
 * @returns Array of recommendations
 */
export function getColorBlindnessRecommendations(shades: ColorShades): string[] {
  const recommendations: string[] = [];
  const analysis = analyzePaletteAccessibility(shades);

  // Check red-green color blindness (most common)
  const redGreenTypes: ColorBlindnessType[] = ['protanopia', 'deuteranopia', 'protanomaly', 'deuteranomaly'];
  const redGreenScores = redGreenTypes.map(type => analysis[type].distinguishablePercentage);
  const avgRedGreenScore = redGreenScores.reduce((a, b) => a + b, 0) / redGreenScores.length;

  if (avgRedGreenScore < 70) {
    recommendations.push(
      'Consider increasing brightness differences between shades to improve distinction for red-green color blindness (affects ~8% of males).'
    );
  }

  // Check blue-yellow color blindness
  if (analysis.tritanopia.severity === 'poor' || analysis.tritanomaly.severity === 'poor') {
    recommendations.push(
      'Add more luminance variation to help users with blue-yellow color blindness distinguish between shades.'
    );
  }

  // Check complete color blindness
  if (analysis.achromatopsia.severity === 'poor') {
    recommendations.push(
      'Ensure sufficient luminance contrast between shades for users with complete color blindness who see only in grayscale.'
    );
  }

  // General recommendation if multiple issues
  const poorCount = Object.values(analysis).filter(a => a.severity === 'poor').length;
  if (poorCount >= 4) {
    recommendations.push(
      'Consider using patterns, textures, or labels in addition to color to convey information for maximum accessibility.'
    );
  }

  return recommendations;
}
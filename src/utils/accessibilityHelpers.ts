/**
 * Accessibility utilities for WCAG compliance and contrast checking
 */

import chroma from 'chroma-js';
import type { ColorShades, ShadeLevel } from '@/types';

// WCAG compliance levels
export type WCAGLevel = 'AAA' | 'AA' | 'Fail';

// Contrast matrix data structure
export interface ContrastMatrixData {
  shades: Array<{ shade: string; color: string }>;
  matrix: Array<Array<{ ratio: number; level: WCAGLevel }>>;
}

// Accessibility warning types
export interface AccessibilityWarning {
  type: 'low-contrast' | 'insufficient-range' | 'similar-shades';
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedShades?: string[];
}

// Shade levels for iteration
const SHADE_LEVELS: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * Calculate the contrast ratio between two colors
 * @param color1 - First color in any format
 * @param color2 - Second color in any format
 * @returns Contrast ratio between 1 and 21
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    return chroma.contrast(color1, color2);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1;
  }
}

/**
 * Determine WCAG compliance level based on contrast ratio
 * @param ratio - Contrast ratio
 * @param isLargeText - Whether the text is large (>= 18pt or >= 14pt bold)
 * @returns WCAG compliance level
 */
export function getWCAGLevel(ratio: number, isLargeText: boolean = false): WCAGLevel {
  // WCAG 2.1 Level AAA
  if (ratio >= 7 && !isLargeText) return 'AAA';
  if (ratio >= 4.5 && isLargeText) return 'AAA';

  // WCAG 2.1 Level AA
  if (ratio >= 4.5 && !isLargeText) return 'AA';
  if (ratio >= 3 && isLargeText) return 'AA';

  // Fail WCAG requirements
  return 'Fail';
}

/**
 * Calculate a full contrast matrix for all shade combinations
 * @param shades - Color shades object
 * @returns Contrast matrix data with ratios and WCAG levels
 */
export function calculateContrastMatrix(shades: ColorShades): ContrastMatrixData {
  const shadesArray = SHADE_LEVELS.map(level => ({
    shade: level.toString(),
    color: shades[level],
  }));

  const matrix: Array<Array<{ ratio: number; level: WCAGLevel }>> = [];

  // Calculate contrast ratio for each combination
  for (let i = 0; i < shadesArray.length; i++) {
    const row: Array<{ ratio: number; level: WCAGLevel }> = [];

    for (let j = 0; j < shadesArray.length; j++) {
      const ratio = calculateContrastRatio(shadesArray[i].color, shadesArray[j].color);
      const level = getWCAGLevel(ratio, false);

      row.push({ ratio, level });
    }

    matrix.push(row);
  }

  return {
    shades: shadesArray,
    matrix,
  };
}

/**
 * Analyze palette for accessibility warnings
 * @param shades - Color shades to analyze
 * @returns Array of accessibility warnings
 */
export function getAccessibilityWarnings(shades: ColorShades): AccessibilityWarning[] {
  const warnings: AccessibilityWarning[] = [];

  // Check contrast between extreme shades
  const extremeContrast = calculateContrastRatio(shades[50], shades[900]);
  if (extremeContrast < 7) {
    warnings.push({
      type: 'insufficient-range',
      severity: 'warning',
      message: `The contrast between lightest (50) and darkest (900) shades is only ${extremeContrast.toFixed(2)}:1. Consider increasing the range for better accessibility.`,
      affectedShades: ['50', '900'],
    });
  }

  // Check for low contrast between adjacent shades
  const lowContrastPairs: string[] = [];
  for (let i = 0; i < SHADE_LEVELS.length - 1; i++) {
    const currentShade = SHADE_LEVELS[i];
    const nextShade = SHADE_LEVELS[i + 1];
    const contrast = calculateContrastRatio(shades[currentShade], shades[nextShade]);

    if (contrast < 1.5) {
      lowContrastPairs.push(`${currentShade}-${nextShade}`);
    }
  }

  if (lowContrastPairs.length > 0) {
    warnings.push({
      type: 'similar-shades',
      severity: 'info',
      message: `Some adjacent shades have very similar colors: ${lowContrastPairs.join(', ')}. This might make them hard to distinguish.`,
      affectedShades: lowContrastPairs,
    });
  }

  // Check primary color (500) contrast with white and black
  const primaryWithWhite = calculateContrastRatio(shades[500], '#FFFFFF');
  const primaryWithBlack = calculateContrastRatio(shades[500], '#000000');

  if (primaryWithWhite < 4.5 && primaryWithBlack < 4.5) {
    warnings.push({
      type: 'low-contrast',
      severity: 'error',
      message: 'Primary color (500) does not meet AA standards for text on either white or black backgrounds.',
      affectedShades: ['500'],
    });
  } else if (primaryWithWhite < 3 && primaryWithBlack < 3) {
    warnings.push({
      type: 'low-contrast',
      severity: 'warning',
      message: 'Primary color (500) has poor contrast with both white and black backgrounds. Consider adjusting for better legibility.',
      affectedShades: ['500'],
    });
  }

  // Check if palette has enough accessible combinations
  const matrix = calculateContrastMatrix(shades);
  let accessibleCombinations = 0;
  const totalCombinations = matrix.matrix.length * matrix.matrix[0].length;

  for (let i = 0; i < matrix.matrix.length; i++) {
    for (let j = 0; j < matrix.matrix[i].length; j++) {
      if (i !== j && (matrix.matrix[i][j].level === 'AA' || matrix.matrix[i][j].level === 'AAA')) {
        accessibleCombinations++;
      }
    }
  }

  const accessiblePercentage = (accessibleCombinations / (totalCombinations - SHADE_LEVELS.length)) * 100;

  if (accessiblePercentage < 30) {
    warnings.push({
      type: 'low-contrast',
      severity: 'warning',
      message: `Only ${accessiblePercentage.toFixed(1)}% of shade combinations meet WCAG AA standards. Consider increasing contrast between shades.`,
    });
  }

  return warnings;
}

/**
 * Get recommended text color (black or white) for a background color
 * @param backgroundColor - Background color in any format
 * @returns '#000000' or '#FFFFFF' for optimal contrast
 */
export function getTextColorForBackground(backgroundColor: string): string {
  try {
    const color = chroma(backgroundColor);
    const luminance = color.luminance();

    // Use white text on dark backgrounds, black on light
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.error('Error determining text color:', error);
    return '#000000';
  }
}

/**
 * Check if two colors meet a specific WCAG level
 * @param color1 - First color
 * @param color2 - Second color
 * @param targetLevel - Target WCAG level
 * @param isLargeText - Whether checking for large text
 * @returns Whether the colors meet the target level
 */
export function meetsWCAGLevel(
  color1: string,
  color2: string,
  targetLevel: 'AA' | 'AAA',
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  const level = getWCAGLevel(ratio, isLargeText);

  if (targetLevel === 'AAA') {
    return level === 'AAA';
  }

  return level === 'AAA' || level === 'AA';
}

/**
 * Find all shade pairs that meet a specific WCAG level
 * @param shades - Color shades to check
 * @param targetLevel - Target WCAG level
 * @param isLargeText - Whether checking for large text
 * @returns Array of shade pairs that meet the criteria
 */
export function findAccessiblePairs(
  shades: ColorShades,
  targetLevel: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): Array<{ shade1: ShadeLevel; shade2: ShadeLevel; ratio: number }> {
  const accessiblePairs: Array<{ shade1: ShadeLevel; shade2: ShadeLevel; ratio: number }> = [];

  for (let i = 0; i < SHADE_LEVELS.length; i++) {
    for (let j = i + 1; j < SHADE_LEVELS.length; j++) {
      const shade1 = SHADE_LEVELS[i];
      const shade2 = SHADE_LEVELS[j];
      const ratio = calculateContrastRatio(shades[shade1], shades[shade2]);

      if (meetsWCAGLevel(shades[shade1], shades[shade2], targetLevel, isLargeText)) {
        accessiblePairs.push({ shade1, shade2, ratio });
      }
    }
  }

  return accessiblePairs;
}
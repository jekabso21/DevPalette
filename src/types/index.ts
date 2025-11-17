/**
 * Type definitions for DevPalette application
 */

// Color shade levels following Material Design pattern
export type ShadeLevel = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// Interface for a complete color palette with all shades
export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Primary color
  600: string;
  700: string;
  800: string;
  900: string;
}

// Color format types
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

// Interface for color values in different formats
export interface ColorValue {
  hex: string;
  rgb: string;
  hsl: string;
}

// Interface for a single color swatch
export interface ColorSwatchData {
  shade: ShadeLevel;
  hex: string;
  rgb: string;
  hsl: string;
  isLight: boolean; // Determines text color for contrast
}

// Color scheme generation methods
export type ColorSchemeType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic';

// Palette types including split-complementary
export type PaletteType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'tetradic';

// Interface for color scheme
export interface ColorScheme {
  type: ColorSchemeType;
  primary: string;
  colors: string[];
  shades: ColorShades[];
}

// Interface for enhanced color palette
export interface ColorPalette {
  type: PaletteType;
  name: string;
  description: string;
  colors: string[];
  shades: ColorShades[];
}

// Interface for individual palette variation
export interface PaletteVariation {
  name: string;
  description: string;
  colors: string[];
  shades: ColorShades[];
  metadata?: {
    angle?: number;
    rotation?: number;
    split?: number;
    spread?: number;
  };
}

// Interface for palette with variations
export interface PaletteWithVariations {
  type: PaletteType;
  name: string;
  description: string;
  variations: PaletteVariation[];
}

// Props for ColorSwatch component
export interface ColorSwatchProps {
  color: ColorSwatchData;
  onClick?: (color: ColorSwatchData) => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
}

// Props for SchemeDisplay component
export interface SchemeDisplayProps {
  primaryColor: string;
  shades: ColorShades;
  onColorClick?: (color: ColorSwatchData) => void;
  showLabels?: boolean;
}

// Props for ColorPicker component
export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
}

// Props for Header component
export interface HeaderProps {
  title?: string;
  showColorModeToggle?: boolean;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Clipboard hook return type
export interface UseClipboardReturn {
  copy: (text: string) => Promise<void>;
  copied: boolean;
  error: Error | null;
  reset: () => void;
}

// Color validation result
export interface ColorValidationResult {
  isValid: boolean;
  format: ColorFormat | null;
  normalizedValue: string | null;
  error?: string;
}

// Shade generation options
export interface ShadeGenerationOptions {
  lightnessSteps?: number[];
  saturationAdjustment?: boolean;
  preserveHue?: boolean;
}

// Export utility type for strict shade indexing
export type ShadeMap<T> = Record<ShadeLevel, T>;

// Type guard for ShadeLevel
export function isShadeLevel(value: number): value is ShadeLevel {
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value);
}

// Type guard for valid hex color
export function isValidHexColor(value: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
}

// Type guard for color format
export function isColorFormat(value: string): value is ColorFormat {
  return ['hex', 'rgb', 'hsl'].includes(value);
}
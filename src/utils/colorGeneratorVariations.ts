import chroma from 'chroma-js';
import { generateShades } from './shadeGenerator';
import type { PaletteVariation, PaletteWithVariations, PaletteType } from '@/types';

/**
 * Generate monochromatic palette variations
 * Single variation showing full shade range
 */
export function generateMonochromaticVariations(color: string): PaletteWithVariations {
  const shades = generateShades(color);

  return {
    type: 'monochromatic',
    name: 'Monochromatic',
    description: 'Different shades and tints of the same color',
    variations: [
      {
        name: 'Full Spectrum',
        description: '50-900 shade range',
        colors: Object.values(shades),
        shades: [shades],
      },
    ],
  };
}

/**
 * Generate analogous palette variations with different angle spreads
 */
export function generateAnalogousVariations(color: string): PaletteWithVariations {
  try {
    const [h, s, l] = chroma(color).hsl();
    const variations: PaletteVariation[] = [];

    // Different angle spreads for variations
    const angles = [
      { spread: 15, name: 'Tight Harmony', description: 'Very close colors (±15°)' },
      { spread: 30, name: 'Standard', description: 'Classic harmony (±30°)' },
      { spread: 45, name: 'Wide Harmony', description: 'Broader range (±45°)' },
      { spread: 60, name: 'Very Wide', description: 'Maximum spread (±60°)' },
    ];

    for (const angle of angles) {
      const colors = [
        chroma.hsl((h - angle.spread + 360) % 360, s, l).hex(),
        color,
        chroma.hsl((h + angle.spread) % 360, s, l).hex(),
      ];

      variations.push({
        name: angle.name,
        description: angle.description,
        colors,
        shades: colors.map(c => generateShades(c)),
        metadata: { spread: angle.spread },
      });
    }

    return {
      type: 'analogous',
      name: 'Analogous Palettes',
      description: 'Adjacent colors creating harmonious combinations',
      variations,
    };
  } catch {
    return {
      type: 'analogous',
      name: 'Analogous Palettes',
      description: 'Adjacent colors creating harmonious combinations',
      variations: [],
    };
  }
}

/**
 * Generate complementary palette variations
 */
export function generateComplementaryVariations(color: string): PaletteWithVariations {
  try {
    const [h, s, l] = chroma(color).hsl();
    const variations: PaletteVariation[] = [];

    // Different complement angles
    const complements = [
      { angle: 180, name: 'Direct Complement', description: 'Exact opposite (180°)' },
      { angle: 165, name: 'Near Complement', description: 'Slightly offset (165°)' },
      { angle: 195, name: 'Far Complement', description: 'Wider offset (195°)' },
    ];

    for (const comp of complements) {
      const complementHue = (h + comp.angle) % 360;
      const colors = [
        color,
        chroma.hsl(complementHue, s, l).hex(),
      ];

      variations.push({
        name: comp.name,
        description: comp.description,
        colors,
        shades: colors.map(c => generateShades(c)),
        metadata: { angle: comp.angle },
      });
    }

    return {
      type: 'complementary',
      name: 'Complementary Palettes',
      description: 'Opposite colors on the color wheel for high contrast',
      variations,
    };
  } catch {
    return {
      type: 'complementary',
      name: 'Complementary Palettes',
      description: 'Opposite colors on the color wheel for high contrast',
      variations: [],
    };
  }
}

/**
 * Generate triadic palette variations with different rotations
 */
export function generateTriadicVariations(color: string): PaletteWithVariations {
  try {
    const [h, s, l] = chroma(color).hsl();
    const variations: PaletteVariation[] = [];

    // Different starting rotations
    const rotations = [
      { rotation: 0, name: 'Standard Triadic', description: 'Classic 120° spacing' },
      { rotation: 30, name: 'Rotated 30°', description: 'Shifted harmony' },
      { rotation: 60, name: 'Rotated 60°', description: 'Alternative harmony' },
    ];

    for (const rot of rotations) {
      const baseHue = (h + rot.rotation) % 360;
      const colors = [
        chroma.hsl(baseHue, s, l).hex(),
        chroma.hsl((baseHue + 120) % 360, s, l).hex(),
        chroma.hsl((baseHue + 240) % 360, s, l).hex(),
      ];

      variations.push({
        name: rot.name,
        description: rot.description,
        colors,
        shades: colors.map(c => generateShades(c)),
        metadata: { rotation: rot.rotation },
      });
    }

    return {
      type: 'triadic',
      name: 'Triadic Palettes',
      description: 'Three colors evenly spaced on the color wheel',
      variations,
    };
  } catch {
    return {
      type: 'triadic',
      name: 'Triadic Palettes',
      description: 'Three colors evenly spaced on the color wheel',
      variations: [],
    };
  }
}

/**
 * Generate split-complementary palette variations
 */
export function generateSplitComplementaryVariations(color: string): PaletteWithVariations {
  try {
    const [h, s, l] = chroma(color).hsl();
    const variations: PaletteVariation[] = [];

    // Different split angles
    const splits = [
      { split: 30, name: 'Small Split', description: 'Narrow split (±30°)' },
      { split: 45, name: 'Medium Split', description: 'Standard split (±45°)' },
      { split: 60, name: 'Large Split', description: 'Wide split (±60°)' },
    ];

    for (const split of splits) {
      const complementHue = (h + 180) % 360;
      const colors = [
        color,
        chroma.hsl((complementHue - split.split + 360) % 360, s, l).hex(),
        chroma.hsl((complementHue + split.split) % 360, s, l).hex(),
      ];

      variations.push({
        name: split.name,
        description: split.description,
        colors,
        shades: colors.map(c => generateShades(c)),
        metadata: { split: split.split },
      });
    }

    return {
      type: 'split-complementary',
      name: 'Split-Complementary Palettes',
      description: 'Base color with two adjacent complements',
      variations,
    };
  } catch {
    return {
      type: 'split-complementary',
      name: 'Split-Complementary Palettes',
      description: 'Base color with two adjacent complements',
      variations: [],
    };
  }
}

/**
 * Generate tetradic palette variations
 */
export function generateTetradicVariations(color: string): PaletteWithVariations {
  try {
    const [h, s, l] = chroma(color).hsl();
    const variations: PaletteVariation[] = [];

    // Different tetradic configurations
    const configs = [
      {
        angles: [0, 90, 180, 270],
        name: 'Square',
        description: 'Four colors in a square (90° each)',
      },
      {
        angles: [0, 60, 180, 240],
        name: 'Rectangle',
        description: 'Rectangle pattern (60°-120°)',
      },
      {
        angles: [0, 120, 180, 300],
        name: 'Alternative',
        description: 'Wide rectangle (120°-60°)',
      },
    ];

    for (const config of configs) {
      const colors = config.angles.map(angle =>
        chroma.hsl((h + angle) % 360, s, l).hex()
      );

      variations.push({
        name: config.name,
        description: config.description,
        colors,
        shades: colors.map(c => generateShades(c)),
        metadata: { angle: config.angles[1] },
      });
    }

    return {
      type: 'tetradic',
      name: 'Tetradic Palettes',
      description: 'Four colors forming geometric patterns',
      variations,
    };
  } catch {
    return {
      type: 'tetradic',
      name: 'Tetradic Palettes',
      description: 'Four colors forming geometric patterns',
      variations: [],
    };
  }
}

/**
 * Generate all palette variations for a given color
 */
export function generateAllPaletteVariations(color: string): Record<PaletteType, PaletteWithVariations> {
  return {
    monochromatic: generateMonochromaticVariations(color),
    analogous: generateAnalogousVariations(color),
    complementary: generateComplementaryVariations(color),
    triadic: generateTriadicVariations(color),
    'split-complementary': generateSplitComplementaryVariations(color),
    tetradic: generateTetradicVariations(color),
  };
}

/**
 * Get palette variations by type
 */
export function getPaletteVariationsByType(color: string, type: PaletteType): PaletteWithVariations {
  switch (type) {
    case 'monochromatic':
      return generateMonochromaticVariations(color);
    case 'analogous':
      return generateAnalogousVariations(color);
    case 'complementary':
      return generateComplementaryVariations(color);
    case 'triadic':
      return generateTriadicVariations(color);
    case 'split-complementary':
      return generateSplitComplementaryVariations(color);
    case 'tetradic':
      return generateTetradicVariations(color);
    default:
      return generateMonochromaticVariations(color);
  }
}
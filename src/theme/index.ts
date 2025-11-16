import { extendTheme, type ThemeConfig, type Theme } from '@chakra-ui/react';

// Theme configuration with dark mode as default
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Custom color palette with neon lime green accent
const colors = {
  brand: {
    50: '#f4fce3',
    100: '#e7f8c1',
    200: '#d3f086',
    300: '#bce64a',
    400: '#a6d61a',
    500: '#84CC16', // Primary neon lime green
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  },
  // Additional semantic colors
  accent: {
    lime: '#84CC16',
    limeLight: '#a6d61a',
    limeDark: '#65a30d',
  },
  // Override gray scale for better dark mode
  gray: {
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
  },
};

// Custom component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'gray.900',
        _hover: {
          bg: 'brand.400',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.600',
        },
      },
      ghost: {
        color: 'brand.400',
        _hover: {
          bg: 'whiteAlpha.100',
          color: 'brand.300',
        },
        _active: {
          bg: 'whiteAlpha.200',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.400',
        _hover: {
          bg: 'whiteAlpha.50',
          borderColor: 'brand.400',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Input: {
    baseStyle: {
      field: {
        _focusVisible: {
          borderColor: 'brand.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
        },
      },
    },
    variants: {
      filled: {
        field: {
          bg: 'gray.800',
          _hover: {
            bg: 'gray.700',
          },
          _focus: {
            bg: 'gray.800',
            borderColor: 'brand.400',
          },
        },
      },
      outline: {
        field: {
          borderColor: 'gray.600',
          _hover: {
            borderColor: 'gray.500',
          },
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'gray.800',
        borderRadius: 'lg',
        borderWidth: '1px',
        borderColor: 'gray.700',
      },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: 'gray.700',
      color: 'gray.100',
      borderRadius: 'md',
      px: 3,
      py: 2,
      fontSize: 'sm',
      fontWeight: 'medium',
      boxShadow: 'xl',
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'gray.800',
      },
      header: {
        color: 'gray.100',
      },
      body: {
        color: 'gray.200',
      },
      footer: {
        borderTopWidth: '1px',
        borderColor: 'gray.700',
      },
    },
  },
  Popover: {
    baseStyle: {
      content: {
        bg: 'gray.800',
        borderColor: 'gray.700',
      },
      header: {
        borderBottomWidth: '1px',
        borderColor: 'gray.700',
      },
      body: {
        color: 'gray.200',
      },
    },
  },
  Drawer: {
    baseStyle: {
      dialog: {
        bg: 'gray.800',
      },
      header: {
        color: 'gray.100',
      },
      body: {
        color: 'gray.200',
      },
    },
  },
};

// Custom semantic tokens for dark/light mode
const semanticTokens = {
  colors: {
    'text.primary': {
      default: 'gray.900',
      _dark: 'gray.100',
    },
    'text.secondary': {
      default: 'gray.600',
      _dark: 'gray.400',
    },
    'bg.primary': {
      default: 'white',
      _dark: 'gray.900',
    },
    'bg.secondary': {
      default: 'gray.50',
      _dark: 'gray.800',
    },
    'bg.tertiary': {
      default: 'gray.100',
      _dark: 'gray.700',
    },
    'border.primary': {
      default: 'gray.200',
      _dark: 'gray.700',
    },
    'border.secondary': {
      default: 'gray.300',
      _dark: 'gray.600',
    },
    'brand.primary': {
      default: 'brand.500',
      _dark: 'brand.400',
    },
    'brand.secondary': {
      default: 'brand.600',
      _dark: 'brand.300',
    },
  },
};

// Global styles
const styles = {
  global: {
    'html, body': {
      bg: 'bg.primary',
      color: 'text.primary',
      lineHeight: 'tall',
    },
    '*::placeholder': {
      color: 'text.secondary',
    },
    '*, *::before, &::after': {
      borderColor: 'border.primary',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'gray.800',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'gray.600',
      borderRadius: 'full',
      _hover: {
        bg: 'gray.500',
      },
    },
  },
};

// Custom fonts
const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  mono: `'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
};

// Breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Create extended theme
const theme: Theme = extendTheme({
  config,
  colors,
  components,
  semanticTokens,
  styles,
  fonts,
  breakpoints,
  // Additional theme extensions
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  sizes: {
    max: 'max-content',
    min: 'min-content',
    full: '100%',
    '3xs': '14rem',
    '2xs': '16rem',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    '8xl': '90rem',
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(132, 204, 22, 0.5)',
    none: 'none',
    'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
});

export default theme;
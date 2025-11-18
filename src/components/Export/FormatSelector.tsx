/**
 * FormatSelector component for choosing export format
 */

import { memo } from 'react';
import {
  Button,
  Grid,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  SiTailwindcss,
  SiCss3,
  SiSass,
  SiJavascript,
  SiFigma,
} from 'react-icons/si';
import { ExportFormat } from '../../types';

interface FormatOption {
  value: ExportFormat;
  label: string;
  icon: typeof SiTailwindcss;
  description: string;
  color: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'tailwind',
    label: 'Tailwind CSS',
    icon: SiTailwindcss,
    description: 'Tailwind config format',
    color: 'cyan',
  },
  {
    value: 'css',
    label: 'CSS Variables',
    icon: SiCss3,
    description: 'CSS custom properties',
    color: 'blue',
  },
  {
    value: 'scss',
    label: 'SCSS/SASS',
    icon: SiSass,
    description: 'SCSS variables',
    color: 'pink',
  },
  {
    value: 'javascript',
    label: 'JavaScript/TS',
    icon: SiJavascript,
    description: 'JS/TS object export',
    color: 'yellow',
  },
  {
    value: 'figma',
    label: 'Figma Plugin',
    icon: SiFigma,
    description: 'Figma JSON format',
    color: 'purple',
  },
];

interface FormatSelectorProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

export const FormatSelector = memo(({ selectedFormat, onFormatChange }: FormatSelectorProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');
  const selectedBorder = useColorModeValue('brand.500', 'brand.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
      gap={3}
      w="full"
    >
      {FORMAT_OPTIONS.map((option) => {
        const isSelected = selectedFormat === option.value;

        return (
          <Button
            key={option.value}
            variant="outline"
            h="auto"
            p={4}
            bg={isSelected ? selectedBg : cardBg}
            borderColor={isSelected ? selectedBorder : cardBorder}
            borderWidth={isSelected ? 2 : 1}
            _hover={{
              bg: isSelected ? selectedBg : hoverBg,
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            onClick={() => onFormatChange(option.value)}
            transition="all 0.2s"
            aria-label={`Select ${option.label} format`}
            aria-pressed={isSelected}
          >
            <VStack spacing={2}>
              <Icon
                as={option.icon}
                boxSize={6}
                color={isSelected ? `${option.color}.500` : `${option.color}.400`}
              />
              <Text fontSize="sm" fontWeight="semibold">
                {option.label}
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                {option.description}
              </Text>
            </VStack>
          </Button>
        );
      })}
    </Grid>
  );
});

FormatSelector.displayName = 'FormatSelector';
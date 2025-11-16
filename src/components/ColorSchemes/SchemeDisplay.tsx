import { memo, useMemo } from 'react';
import {
  Box,
  Grid,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Container,
  Flex,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { FaDownload, FaCopy, FaCode } from 'react-icons/fa';
import { ColorSwatch } from './ColorSwatch';
import type { SchemeDisplayProps, ColorSwatchData, ShadeLevel } from '@/types';
import { convertColor, isLightShade } from '@/utils/colorHelpers';
import { useClipboard } from '@/hooks/useClipboard';

/**
 * Display component for all color shades in a scheme
 * Shows a responsive grid of color swatches
 */
export const SchemeDisplay = memo(function SchemeDisplay({
  primaryColor,
  shades,
  onColorClick,
  showLabels = true,
}: SchemeDisplayProps) {
  const { copy } = useClipboard();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  /**
   * Convert shades to ColorSwatchData array
   */
  const swatchData = useMemo<ColorSwatchData[]>(() => {
    const levels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    return levels.map((level) => {
      const hex = shades[level];
      const colorValue = convertColor(hex);

      return {
        shade: level,
        hex,
        rgb: colorValue?.rgb || 'rgb(0, 0, 0)',
        hsl: colorValue?.hsl || 'hsl(0, 0%, 0%)',
        isLight: isLightShade(hex),
      };
    });
  }, [shades]);

  /**
   * Export shades as CSS variables
   */
  const exportAsCSSVariables = async () => {
    const cssVars = swatchData
      .map((swatch) => `  --color-primary-${swatch.shade}: ${swatch.hex};`)
      .join('\n');

    const output = `:root {\n${cssVars}\n}`;

    try {
      await copy(output);
      toast({
        title: 'CSS Variables Copied!',
        description: 'Color palette exported as CSS variables',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * Export shades as JSON
   */
  const exportAsJSON = async () => {
    const jsonOutput = JSON.stringify(shades, null, 2);

    try {
      await copy(jsonOutput);
      toast({
        title: 'JSON Copied!',
        description: 'Color palette exported as JSON',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * Export as Tailwind config
   */
  const exportAsTailwind = async () => {
    const tailwindConfig = `colors: {\n  primary: ${JSON.stringify(shades, null, 4).replace(/"([^"]+)":/g, '$1:')}\n}`;

    try {
      await copy(tailwindConfig);
      toast({
        title: 'Tailwind Config Copied!',
        description: 'Color palette exported for Tailwind CSS',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      boxShadow="sm"
    >
      {/* Header */}
      <Flex
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor={borderColor}
        align="center"
        justify="space-between"
        flexWrap="wrap"
        gap={4}
      >
        <VStack align="start" spacing={1}>
          <Heading size="md" color={headingColor}>
            Color Palette
          </Heading>
          <Text fontSize="sm" color={textColor}>
            Primary: {primaryColor}
          </Text>
        </VStack>

        <HStack spacing={2} flexWrap="wrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FaCopy />}
            onClick={exportAsCSSVariables}
            aria-label="Export as CSS variables"
          >
            CSS
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FaCode />}
            onClick={exportAsJSON}
            aria-label="Export as JSON"
          >
            JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FaDownload />}
            onClick={exportAsTailwind}
            aria-label="Export for Tailwind"
          >
            Tailwind
          </Button>
        </HStack>
      </Flex>

      {/* Color Swatches Grid */}
      <Container maxW="container.xl" py={6}>
        <SimpleGrid
          columns={{ base: 2, sm: 5, md: 5, lg: 10 }}
          spacing={{ base: 2, md: 3 }}
        >
          {swatchData.map((swatch) => (
            <Box key={swatch.shade} width="100%">
              <ColorSwatch
                color={swatch}
                onClick={onColorClick}
                showLabels={showLabels}
                size="md"
                isInteractive
              />
            </Box>
          ))}
        </SimpleGrid>

        {/* Alternative layout for larger swatches */}
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
            lg: 'repeat(10, 1fr)',
          }}
          gap={{ base: 2, md: 3 }}
          mt={6}
          display="none" // Hidden by default, can be toggled
        >
          {swatchData.map((swatch) => (
            <VStack key={`alt-${swatch.shade}`} spacing={2}>
              <ColorSwatch
                color={swatch}
                onClick={onColorClick}
                showLabels={false}
                size="lg"
                isInteractive
              />
              <VStack spacing={0} align="center">
                <Text fontSize="xs" fontWeight="bold" color={textColor}>
                  {swatch.shade}
                </Text>
                <Text fontSize="xs" fontFamily="mono" color={textColor}>
                  {swatch.hex}
                </Text>
              </VStack>
            </VStack>
          ))}
        </Grid>
      </Container>

      {/* Footer with additional info */}
      <Box
        px={6}
        py={3}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Text fontSize="xs" color={textColor} textAlign="center">
          Click any color to copy its hex value to clipboard
        </Text>
      </Box>
    </Box>
  );
});

SchemeDisplay.displayName = 'SchemeDisplay';
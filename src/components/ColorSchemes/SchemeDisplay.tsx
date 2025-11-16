import { memo, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  VStack,
  Text,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
  Tooltip,
} from '@chakra-ui/react';
import type { SchemeDisplayProps, ColorSwatchData, ShadeLevel } from '@/types';
import { convertColor, isLightShade } from '@/utils/colorHelpers';
import { useClipboard } from '@/hooks/useClipboard';

/**
 * Simplified scheme display for Phase 1
 * Clean grid of color swatches with click-to-copy functionality
 */
export const SchemeDisplay = memo(function SchemeDisplay({
  shades,
}: SchemeDisplayProps) {
  const { copy } = useClipboard();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const instructionColor = useColorModeValue('gray.500', 'gray.400');

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
   * Handle swatch click with toast feedback
   */
  const handleSwatchClick = useCallback(async (color: ColorSwatchData) => {
    try {
      await copy(color.hex);
      toast({
        title: 'Copied!',
        description: `${color.hex} (${color.shade})`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [copy, toast]);

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {/* Instruction */}
      <Text
        textAlign="center"
        fontSize="sm"
        color={instructionColor}
        fontWeight="medium"
      >
        Click any color to copy
      </Text>

      {/* Color Grid */}
      <Card
        bg={bgColor}
        borderColor={borderColor}
        variant="outline"
        overflow="hidden"
      >
        <CardBody p={{ base: 4, md: 6 }}>
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              sm: 'repeat(5, 1fr)',
              md: 'repeat(5, 1fr)',
              lg: 'repeat(10, 1fr)',
            }}
            gap={{ base: 3, md: 4 }}
            w="100%"
          >
            {swatchData.map((swatch) => (
              <VStack
                key={swatch.shade}
                spacing={2}
                w="100%"
              >
                <Tooltip
                  label={`Click to copy ${swatch.hex}`}
                  placement="top"
                  hasArrow
                  openDelay={300}
                >
                  <Box
                    as="button"
                    w="100%"
                    position="relative"
                    onClick={() => handleSwatchClick(swatch)}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-4px)',
                    }}
                    _active={{
                      transform: 'translateY(-2px)',
                    }}
                  >
                    <Box
                      h={{ base: '80px', md: '100px', lg: '120px' }}
                      w="100%"
                      bg={swatch.hex}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={borderColor}
                      boxShadow="sm"
                      transition="all 0.2s"
                      _hover={{
                        boxShadow: 'lg',
                        borderColor: 'brand.400',
                      }}
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Shade number on the swatch */}
                      <Box
                        position="absolute"
                        top={2}
                        left={2}
                        bg={swatch.isLight ? 'blackAlpha.100' : 'whiteAlpha.100'}
                        borderRadius="sm"
                        px={1.5}
                        py={0.5}
                      >
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color={swatch.isLight ? 'gray.800' : 'white'}
                        >
                          {swatch.shade}
                        </Text>
                      </Box>

                      {/* Primary indicator */}
                      {swatch.shade === 500 && (
                        <Box
                          position="absolute"
                          bottom={1}
                          right={1}
                          bg="brand.500"
                          borderRadius="full"
                          w={2}
                          h={2}
                          border="2px solid"
                          borderColor={swatch.isLight ? 'gray.800' : 'white'}
                        />
                      )}
                    </Box>
                  </Box>
                </Tooltip>

                {/* Hex value below swatch */}
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  textAlign="center"
                >
                  {swatch.hex}
                </Text>
              </VStack>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </VStack>
  );
});

SchemeDisplay.displayName = 'SchemeDisplay';
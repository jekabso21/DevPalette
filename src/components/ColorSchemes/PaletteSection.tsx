import { memo } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Tooltip,
  IconButton,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { ColorPalette, ShadeLevel } from '@/types';
import { useClipboard } from '@/hooks/useClipboard';
import { getContrastTextColor, convertColor } from '@/utils/colorHelpers';

interface PaletteSectionProps {
  palette: ColorPalette;
  isExpanded?: boolean;
  showShades?: boolean;
}

/**
 * Component to display a color palette section
 * Shows main colors and optionally their shades
 */
export const PaletteSection = memo(function PaletteSection({
  palette,
  isExpanded = true,
  showShades = false,
}: PaletteSectionProps) {
  const { copy, copied } = useClipboard();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isExpanded });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const handleColorClick = async (color: string) => {
    await copy(color);
  };

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      variant="outline"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'lg',
        borderColor: 'brand.400',
      }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <Heading size="md" color={headingColor}>
                {palette.name}
              </Heading>
              <Text fontSize="sm" color={descriptionColor}>
                {palette.description}
              </Text>
            </VStack>
            <IconButton
              aria-label={isOpen ? 'Collapse' : 'Expand'}
              icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
              onClick={onToggle}
              size="sm"
              variant="ghost"
              color={descriptionColor}
            />
          </HStack>

          <Collapse in={isOpen} animateOpacity>
            <VStack align="stretch" spacing={4}>
              {/* Main Colors */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2} color={descriptionColor}>
                  PRIMARY COLORS
                </Text>
                <SimpleGrid
                  columns={{ base: palette.colors.length === 2 ? 2 : 3, md: palette.colors.length }}
                  spacing={3}
                >
                  {palette.colors.map((color, index) => {
                    const colorValue = convertColor(color);
                    const textColor = getContrastTextColor(color);

                    return (
                      <Tooltip
                        key={`${palette.type}-${index}`}
                        label={
                          <VStack spacing={1} p={1}>
                            <Text fontSize="xs" fontFamily="mono">
                              {color}
                            </Text>
                            {colorValue && (
                              <>
                                <Text fontSize="xs">{colorValue.rgb}</Text>
                                <Text fontSize="xs">{colorValue.hsl}</Text>
                              </>
                            )}
                            <Text fontSize="xs" fontWeight="bold">
                              Click to copy
                            </Text>
                          </VStack>
                        }
                        placement="top"
                        hasArrow
                      >
                        <Box
                          as="button"
                          bg={color}
                          h={{ base: '80px', md: '100px' }}
                          borderRadius="lg"
                          position="relative"
                          overflow="hidden"
                          cursor="pointer"
                          transition="all 0.2s"
                          onClick={() => handleColorClick(color)}
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'xl',
                          }}
                          _active={{
                            transform: 'translateY(0)',
                          }}
                        >
                          <Box
                            position="absolute"
                            bottom={2}
                            left={2}
                            right={2}
                            bg={textColor === 'light' ? 'blackAlpha.600' : 'whiteAlpha.900'}
                            borderRadius="md"
                            px={2}
                            py={1}
                          >
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              fontFamily="mono"
                              color={textColor === 'light' ? 'white' : 'black'}
                              textTransform="uppercase"
                            >
                              {color}
                            </Text>
                          </Box>
                          {copied && (
                            <Box
                              position="absolute"
                              top="50%"
                              left="50%"
                              transform="translate(-50%, -50%)"
                              bg={textColor === 'light' ? 'blackAlpha.800' : 'whiteAlpha.900'}
                              px={3}
                              py={2}
                              borderRadius="md"
                              zIndex={1}
                            >
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color={textColor === 'light' ? 'white' : 'black'}
                              >
                                Copied!
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </SimpleGrid>
              </Box>

              {/* Shades (for Monochromatic palette) */}
              {showShades && palette.type === 'monochromatic' && palette.shades[0] && (
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" mb={2} color={descriptionColor}>
                    SHADE VARIATIONS
                  </Text>
                  <SimpleGrid columns={{ base: 5, md: 10 }} spacing={2}>
                    {shadeLevels.map(level => {
                      const shadeColor = palette.shades[0][level];
                      const textColor = getContrastTextColor(shadeColor);

                      return (
                        <Tooltip
                          key={`shade-${level}`}
                          label={
                            <VStack spacing={0}>
                              <Text fontSize="xs" fontWeight="bold">
                                {level}
                              </Text>
                              <Text fontSize="xs" fontFamily="mono">
                                {shadeColor}
                              </Text>
                            </VStack>
                          }
                          placement="top"
                          hasArrow
                        >
                          <Box
                            as="button"
                            bg={shadeColor}
                            h={{ base: '60px', md: '80px' }}
                            borderRadius="md"
                            position="relative"
                            cursor="pointer"
                            transition="all 0.2s"
                            onClick={() => handleColorClick(shadeColor)}
                            _hover={{
                              transform: 'scale(1.05)',
                              boxShadow: 'md',
                              zIndex: 1,
                            }}
                            _active={{
                              transform: 'scale(0.95)',
                            }}
                          >
                            <Text
                              position="absolute"
                              bottom={1}
                              left="50%"
                              transform="translateX(-50%)"
                              fontSize="xs"
                              fontWeight="bold"
                              color={textColor === 'light' ? 'whiteAlpha.900' : 'blackAlpha.700'}
                            >
                              {level}
                            </Text>
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              )}

              {/* Mini shades for other palettes */}
              {showShades && palette.type !== 'monochromatic' && (
                <VStack align="stretch" spacing={3}>
                  {palette.colors.map((color, colorIndex) => (
                    <Box key={`mini-shades-${colorIndex}`}>
                      <HStack mb={2} spacing={2}>
                        <Box
                          w={4}
                          h={4}
                          bg={color}
                          borderRadius="sm"
                          border="1px solid"
                          borderColor={borderColor}
                        />
                        <Text fontSize="xs" fontFamily="mono" color={descriptionColor}>
                          {color}
                        </Text>
                      </HStack>
                      <SimpleGrid columns={10} spacing={1}>
                        {shadeLevels.map(level => {
                          const shadeColor = palette.shades[colorIndex]?.[level] || color;

                          return (
                            <Tooltip
                              key={`mini-${colorIndex}-${level}`}
                              label={`${level}: ${shadeColor}`}
                              placement="top"
                              hasArrow
                            >
                              <Box
                                as="button"
                                bg={shadeColor}
                                h="24px"
                                borderRadius="sm"
                                cursor="pointer"
                                transition="all 0.2s"
                                onClick={() => handleColorClick(shadeColor)}
                                _hover={{
                                  transform: 'scale(1.1)',
                                  zIndex: 1,
                                  boxShadow: 'sm',
                                }}
                              />
                            </Tooltip>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  ))}
                </VStack>
              )}
            </VStack>
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
});

PaletteSection.displayName = 'PaletteSection';
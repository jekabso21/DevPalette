import { memo, useState } from 'react';
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
  Button,
  Collapse,
  useDisclosure,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaInfoCircle } from 'react-icons/fa';
import type { PaletteVariation, ShadeLevel } from '@/types';
import { useClipboard } from '@/hooks/useClipboard';
import { getContrastTextColor, convertColor } from '@/utils/colorHelpers';

interface PaletteVariationCardProps {
  variation: PaletteVariation;
  showShadesInitially?: boolean;
}

/**
 * Component to display a single palette variation card
 * Shows primary colors prominently with expandable shade grid
 */
export const PaletteVariationCard = memo(function PaletteVariationCard({
  variation,
  showShadesInitially = false,
}: PaletteVariationCardProps) {
  const { copy } = useClipboard();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: showShadesInitially });
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const handleColorClick = async (color: string) => {
    await copy(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Determine grid columns based on color count
  const getGridColumns = () => {
    const count = variation.colors.length;
    if (count === 2) return { base: 2, md: 2 };
    if (count === 3) return { base: 3, md: 3 };
    if (count === 4) return { base: 2, md: 4 };
    return { base: 2, md: count };
  };

  // Check if this is a monochromatic palette (has 10 colors for full shade range)
  const isMonochromatic = variation.colors.length === 10;

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
      h="full"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header with name and metadata */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2}>
                <Heading size="sm" color={headingColor}>
                  {variation.name}
                </Heading>
                {variation.metadata && (
                  <Tooltip
                    label={
                      <VStack align="start" spacing={1} p={1}>
                        {variation.metadata.angle && (
                          <Text fontSize="xs">Angle: {variation.metadata.angle}°</Text>
                        )}
                        {variation.metadata.rotation && (
                          <Text fontSize="xs">Rotation: {variation.metadata.rotation}°</Text>
                        )}
                        {variation.metadata.split && (
                          <Text fontSize="xs">Split: ±{variation.metadata.split}°</Text>
                        )}
                        {variation.metadata.spread && (
                          <Text fontSize="xs">Spread: ±{variation.metadata.spread}°</Text>
                        )}
                      </VStack>
                    }
                    placement="top"
                    hasArrow
                  >
                    <Box as="span" color={descriptionColor} cursor="help">
                      <Icon as={FaInfoCircle} boxSize={3} />
                    </Box>
                  </Tooltip>
                )}
              </HStack>
              <Text fontSize="xs" color={descriptionColor}>
                {variation.description}
              </Text>
            </VStack>
          </HStack>

          {/* Color Display Section */}
          {isMonochromatic ? (
            // Monochromatic palette - show full shade range
            <Box>
              <Text fontSize="xs" fontWeight="semibold" mb={2} color={descriptionColor}>
                FULL SHADE RANGE (50-900)
              </Text>
              <SimpleGrid columns={{ base: 5, md: 10 }} spacing={1}>
                {variation.colors.map((color, index) => {
                  const textColor = getContrastTextColor(color);
                  const colorValue = convertColor(color);
                  const isCopied = copiedColor === color;
                  const shadeLevel = shadeLevels[index];

                  return (
                    <Tooltip
                      key={`mono-${index}`}
                      label={
                        <VStack spacing={1} p={1}>
                          <Text fontSize="xs" fontWeight="bold">
                            Shade {shadeLevel}
                          </Text>
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
                        h={{ base: '50px', md: '70px' }}
                        borderRadius="md"
                        position="relative"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.2s"
                        onClick={() => handleColorClick(color)}
                        _hover={{
                          transform: 'scale(1.05)',
                          boxShadow: 'lg',
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
                          {shadeLevel}
                        </Text>
                        {isCopied && (
                          <Flex
                            position="absolute"
                            inset={0}
                            align="center"
                            justify="center"
                            bg={textColor === 'light' ? 'blackAlpha.800' : 'whiteAlpha.900'}
                          >
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color={textColor === 'light' ? 'white' : 'black'}
                            >
                              Copied!
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </SimpleGrid>
            </Box>
          ) : (
            // Other palettes - show primary colors with expandable shades
            <>
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2} color={descriptionColor}>
                  PRIMARY COLORS
                </Text>
                <SimpleGrid columns={getGridColumns()} spacing={2}>
                  {variation.colors.map((color, index) => {
                    const textColor = getContrastTextColor(color);
                    const colorValue = convertColor(color);
                    const isCopied = copiedColor === color;

                    return (
                      <Tooltip
                        key={`primary-${index}`}
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
                          h="60px"
                          borderRadius="md"
                          position="relative"
                          overflow="hidden"
                          cursor="pointer"
                          transition="all 0.2s"
                          onClick={() => handleColorClick(color)}
                          _hover={{
                            transform: 'scale(1.05)',
                            boxShadow: 'lg',
                            zIndex: 1,
                          }}
                          _active={{
                            transform: 'scale(0.95)',
                          }}
                        >
                          {isCopied && (
                            <Flex
                              position="absolute"
                              inset={0}
                              align="center"
                              justify="center"
                              bg={textColor === 'light' ? 'blackAlpha.800' : 'whiteAlpha.900'}
                            >
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color={textColor === 'light' ? 'white' : 'black'}
                              >
                                Copied!
                              </Text>
                            </Flex>
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </SimpleGrid>
              </Box>

              {/* Expandable Shades Section */}
              {variation.shades.length > 0 && (
                <Box>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={onToggle}
                    rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    color={descriptionColor}
                    fontWeight="normal"
                    px={0}
                  >
                    {isOpen ? 'Hide' : 'Show'} shade variations
                  </Button>

                  <Collapse in={isOpen} animateOpacity>
                    <VStack align="stretch" spacing={3} mt={3}>
                      {variation.colors.map((color, colorIndex) => (
                        <Box key={`shades-${colorIndex}`}>
                          <HStack mb={2} spacing={2}>
                            <Box
                              w={3}
                              h={3}
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
                              const shadeColor = variation.shades[colorIndex]?.[level] || color;
                              const isCopied = copiedColor === shadeColor;

                              return (
                                <Tooltip
                                  key={`shade-${colorIndex}-${level}`}
                                  label={`${level}: ${shadeColor}`}
                                  placement="top"
                                  hasArrow
                                >
                                  <Box
                                    as="button"
                                    bg={shadeColor}
                                    h="20px"
                                    borderRadius="xs"
                                    cursor="pointer"
                                    position="relative"
                                    transition="all 0.2s"
                                    onClick={() => handleColorClick(shadeColor)}
                                    _hover={{
                                      transform: 'scale(1.2)',
                                      zIndex: 2,
                                      boxShadow: 'sm',
                                    }}
                                  >
                                    {isCopied && (
                                      <Box
                                        position="absolute"
                                        inset={0}
                                        bg="blackAlpha.700"
                                        borderRadius="xs"
                                      />
                                    )}
                                  </Box>
                                </Tooltip>
                              );
                            })}
                          </SimpleGrid>
                        </Box>
                      ))}
                    </VStack>
                  </Collapse>
                </Box>
              )}
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
});

PaletteVariationCard.displayName = 'PaletteVariationCard';
/**
 * GradientPresetGallery - Display grid of gradient presets
 * Shows intelligently generated gradient presets based on the palette
 */

import { useMemo, memo } from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  Badge,
  HStack,
  Tooltip,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { FaCopy, FaStar, FaFire, FaLeaf, FaPalette, FaBolt } from 'react-icons/fa';
import type { ColorShades } from '@/types';
import { GradientPreset, createGradientPresets } from '@/utils/gradientGenerator';

interface GradientPresetGalleryProps {
  shades: ColorShades;
  primaryColor: string;
  onSelectPreset?: (preset: GradientPreset) => void;
}

const categoryIcons = {
  warm: FaFire,
  cool: FaLeaf,
  subtle: FaPalette,
  bold: FaBolt,
  creative: FaStar,
};

const categoryColors = {
  warm: 'orange',
  cool: 'blue',
  subtle: 'gray',
  bold: 'red',
  creative: 'purple',
};

export const GradientPresetGallery = memo(({
  shades,
  primaryColor,
  onSelectPreset,
}: GradientPresetGalleryProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const toast = useToast();

  // Generate gradient presets
  const presets = useMemo(() => {
    return createGradientPresets(shades, primaryColor);
  }, [shades, primaryColor]);

  // Copy CSS to clipboard
  const copyCSSToClipboard = async (preset: GradientPreset, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(`background: ${preset.cssValue};`);
      toast({
        title: 'Copied!',
        description: `${preset.name} CSS copied to clipboard`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle preset selection
  const handleSelectPreset = (preset: GradientPreset) => {
    if (onSelectPreset) {
      onSelectPreset(preset);
    }
    toast({
      title: 'Preset Applied',
      description: `${preset.name} gradient has been applied`,
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" color={textColor} mb={2}>
          Gradient Presets
        </Heading>
        <Text fontSize="sm" color={mutedTextColor}>
          Click to apply preset, or copy CSS directly
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {presets.map((preset) => {
          const Icon = categoryIcons[preset.category];
          const colorScheme = categoryColors[preset.category];

          return (
            <Box
              key={preset.id}
              as="button"
              onClick={() => handleSelectPreset(preset)}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              borderWidth={2}
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
                borderColor: shades[400],
              }}
              _active={{
                transform: 'translateY(-2px)',
              }}
              cursor="pointer"
              textAlign="left"
              width="full"
            >
              {/* Gradient Preview */}
              <Box
                height="120px"
                background={preset.cssValue}
                position="relative"
              >
                {/* Category Badge */}
                <Badge
                  position="absolute"
                  top={2}
                  left={2}
                  colorScheme={colorScheme}
                  variant="solid"
                  fontSize="xs"
                  px={2}
                  py={1}
                >
                  <HStack spacing={1}>
                    <Icon size={10} />
                    <Text>{preset.category}</Text>
                  </HStack>
                </Badge>

                {/* Copy Button */}
                <Tooltip label="Copy CSS" placement="top">
                  <IconButton
                    aria-label="Copy CSS"
                    icon={<FaCopy />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={(e) => copyCSSToClipboard(preset, e)}
                    bg="whiteAlpha.800"
                    _hover={{ bg: 'whiteAlpha.900' }}
                    color="gray.700"
                  />
                </Tooltip>
              </Box>

              {/* Preset Info */}
              <VStack
                align="start"
                p={3}
                spacing={1}
                bg={cardBg}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Heading size="sm" color={textColor}>
                  {preset.name}
                </Heading>
                <Text fontSize="xs" color={mutedTextColor} noOfLines={2}>
                  {preset.description}
                </Text>

                {/* Gradient Type Info */}
                <HStack spacing={2} mt={1}>
                  <Badge size="sm" variant="outline" colorScheme="gray">
                    {preset.gradient.type}
                  </Badge>
                  <Badge size="sm" variant="outline" colorScheme="gray">
                    {preset.gradient.colors.length} stops
                  </Badge>
                  {preset.gradient.angle !== undefined && (
                    <Badge size="sm" variant="outline" colorScheme="gray">
                      {preset.gradient.angle}°
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Additional Custom Gradients Section */}
      <Box mt={6}>
        <Heading size="sm" color={textColor} mb={3}>
          Quick Combinations
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
          {/* Light to Dark */}
          <Tooltip label="Light to Dark gradient">
            <Box
              as="button"
              height="60px"
              borderRadius="lg"
              background={`linear-gradient(90deg, ${shades[100]} 0%, ${shades[900]} 100%)`}
              borderWidth={2}
              borderColor={borderColor}
              onClick={() => {
                const preset: GradientPreset = {
                  id: 'light-dark',
                  name: 'Light to Dark',
                  description: 'Simple light to dark transition',
                  gradient: {
                    type: 'linear',
                    angle: 90,
                    colors: [
                      { color: shades[100], position: 0 },
                      { color: shades[900], position: 100 },
                    ],
                  },
                  cssValue: `linear-gradient(90deg, ${shades[100]} 0%, ${shades[900]} 100%)`,
                  category: 'subtle',
                };
                handleSelectPreset(preset);
              }}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'md',
              }}
            />
          </Tooltip>

          {/* Primary Fade */}
          <Tooltip label="Primary fade gradient">
            <Box
              as="button"
              height="60px"
              borderRadius="lg"
              background={`linear-gradient(135deg, ${shades[500]} 0%, ${shades[500]}00 100%)`}
              borderWidth={2}
              borderColor={borderColor}
              onClick={() => {
                const preset: GradientPreset = {
                  id: 'primary-fade',
                  name: 'Primary Fade',
                  description: 'Primary color fading to transparent',
                  gradient: {
                    type: 'linear',
                    angle: 135,
                    colors: [
                      { color: shades[500], position: 0 },
                      { color: `${shades[500]}00`, position: 100 },
                    ],
                  },
                  cssValue: `linear-gradient(135deg, ${shades[500]} 0%, ${shades[500]}00 100%)`,
                  category: 'subtle',
                };
                handleSelectPreset(preset);
              }}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'md',
              }}
            />
          </Tooltip>

          {/* Vibrant Mix */}
          <Tooltip label="Vibrant color mix">
            <Box
              as="button"
              height="60px"
              borderRadius="lg"
              background={`linear-gradient(45deg, ${shades[300]} 0%, ${shades[600]} 50%, ${shades[400]} 100%)`}
              borderWidth={2}
              borderColor={borderColor}
              onClick={() => {
                const preset: GradientPreset = {
                  id: 'vibrant-mix',
                  name: 'Vibrant Mix',
                  description: 'Dynamic multi-color blend',
                  gradient: {
                    type: 'linear',
                    angle: 45,
                    colors: [
                      { color: shades[300], position: 0 },
                      { color: shades[600], position: 50 },
                      { color: shades[400], position: 100 },
                    ],
                  },
                  cssValue: `linear-gradient(45deg, ${shades[300]} 0%, ${shades[600]} 50%, ${shades[400]} 100%)`,
                  category: 'creative',
                };
                handleSelectPreset(preset);
              }}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'md',
              }}
            />
          </Tooltip>

          {/* Center Glow */}
          <Tooltip label="Center glow effect">
            <Box
              as="button"
              height="60px"
              borderRadius="lg"
              background={`radial-gradient(circle, ${shades[300]} 0%, ${shades[700]} 100%)`}
              borderWidth={2}
              borderColor={borderColor}
              onClick={() => {
                const preset: GradientPreset = {
                  id: 'center-glow',
                  name: 'Center Glow',
                  description: 'Radial gradient with center highlight',
                  gradient: {
                    type: 'radial',
                    shape: 'circle',
                    colors: [
                      { color: shades[300], position: 0 },
                      { color: shades[700], position: 100 },
                    ],
                  },
                  cssValue: `radial-gradient(circle, ${shades[300]} 0%, ${shades[700]} 100%)`,
                  category: 'creative',
                };
                handleSelectPreset(preset);
              }}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'md',
              }}
            />
          </Tooltip>
        </SimpleGrid>
      </Box>
    </VStack>
  );
});

GradientPresetGallery.displayName = 'GradientPresetGallery';
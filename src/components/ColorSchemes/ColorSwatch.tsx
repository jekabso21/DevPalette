import { memo, useState, useCallback } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Tooltip,
  useColorModeValue,
  useToast,
  Badge,
  Fade,
} from '@chakra-ui/react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import type { ColorSwatchProps } from '@/types';
import { useColorClipboard } from '@/hooks/useClipboard';
import { getContrastTextColor, meetsWCAGAA } from '@/utils/colorHelpers';

/**
 * Individual color swatch component with interactive features
 * Displays color with shade level, click to copy, and hover details
 */
export const ColorSwatch = memo(function ColorSwatch({
  color,
  onClick,
  showLabels = true,
  size = 'md',
  isInteractive = true,
}: ColorSwatchProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { copyColor, copiedColor } = useColorClipboard({ timeout: 2000 });
  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgOverlay = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
  const labelBg = useColorModeValue('white', 'gray.800');
  const tooltipBg = useColorModeValue('gray.700', 'gray.600');
  const hoverIconColor = useColorModeValue('gray.700', 'gray.200');
  const hoverTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelTextColor = useColorModeValue('gray.700', 'gray.200');
  const hexTextColor = useColorModeValue('gray.600', 'gray.300');

  // Size configurations
  const sizeConfig = {
    sm: { height: '48px', fontSize: 'xs', iconSize: 12 },
    md: { height: '60px', fontSize: 'sm', iconSize: 14 },
    lg: { height: '80px', fontSize: 'md', iconSize: 16 },
  };

  const config = sizeConfig[size];
  const textColor = getContrastTextColor(color.hex);
  const isCopied = copiedColor === color.hex;

  /**
   * Handle swatch click
   */
  const handleClick = useCallback(async () => {
    if (!isInteractive) return;

    try {
      await copyColor(color.hex);
      onClick?.(color);

      toast({
        title: 'Copied!',
        description: `${color.hex} copied to clipboard`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
        render: ({ onClose }) => (
          <Box
            bg="brand.500"
            color="gray.900"
            p={3}
            borderRadius="md"
            boxShadow="lg"
            cursor="pointer"
            onClick={onClose}
          >
            <HStack spacing={2}>
              <FaCheck />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">
                  Copied!
                </Text>
                <Text fontSize="xs" fontFamily="mono">
                  {color.hex}
                </Text>
              </VStack>
            </HStack>
          </Box>
        ),
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try selecting and copying manually',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [color, copyColor, onClick, toast, isInteractive]);

  /**
   * Handle keyboard interaction
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isInteractive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick, isInteractive]
  );

  // Tooltip content with color details
  const tooltipContent = (
    <VStack align="start" spacing={1} fontSize="xs">
      <Text fontWeight="bold">Shade {color.shade}</Text>
      <Text fontFamily="mono">{color.hex}</Text>
      <Text>{color.rgb}</Text>
      <Text>{color.hsl}</Text>
      <HStack spacing={1} mt={1}>
        <Text fontSize="10px">Click to copy</Text>
        {meetsWCAGAA(textColor, color.hex, false) && (
          <Badge colorScheme="green" size="sm">
            WCAG AA
          </Badge>
        )}
      </HStack>
    </VStack>
  );

  return (
    <Tooltip
      label={tooltipContent}
      placement="top"
      hasArrow
      isOpen={isInteractive && isHovered && !isCopied}
      bg={tooltipBg}
    >
      <Box
        position="relative"
        minHeight={config.height}
        bg={color.hex}
        borderRadius="md"
        overflow="hidden"
        cursor={isInteractive ? 'pointer' : 'default'}
        transition="all 0.2s ease"
        border="1px solid"
        borderColor={borderColor}
        role={isInteractive ? 'button' : 'presentation'}
        tabIndex={isInteractive ? 0 : -1}
        aria-label={`Color swatch: ${color.hex}, shade ${color.shade}. ${
          isInteractive ? 'Click to copy' : ''
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={
          isInteractive
            ? {
                transform: 'scale(1.02)',
                boxShadow: 'lg',
                zIndex: 10,
              }
            : {}
        }
        _focus={{
          outline: 'none',
          boxShadow: 'outline',
        }}
        _active={
          isInteractive
            ? {
                transform: 'scale(0.98)',
              }
            : {}
        }
      >
        {/* Color fill */}
        <Box
          position="absolute"
          inset={0}
          bg={color.hex}
          aria-hidden="true"
        />

        {/* Hover overlay */}
        <Fade in={isInteractive && isHovered && !isCopied}>
          <Box
            position="absolute"
            inset={0}
            bg={bgOverlay}
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <VStack spacing={1}>
              <Box
                as={FaCopy}
                fontSize={config.iconSize}
                color={hoverIconColor}
              />
              <Text
                fontSize={config.fontSize}
                fontWeight="semibold"
                color={hoverTextColor}
              >
                Copy
              </Text>
            </VStack>
          </Box>
        </Fade>

        {/* Copied state */}
        <Fade in={isCopied}>
          <Box
            position="absolute"
            inset={0}
            bg="brand.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <VStack spacing={1}>
              <Box as={FaCheck} fontSize={config.iconSize} color="gray.900" />
              <Text
                fontSize={config.fontSize}
                fontWeight="bold"
                color="gray.900"
              >
                Copied!
              </Text>
            </VStack>
          </Box>
        </Fade>

        {/* Labels */}
        {showLabels && !isHovered && !isCopied && (
          <>
            {/* Shade level */}
            <Box
              position="absolute"
              top={1}
              left={1}
              bg={labelBg}
              px={1.5}
              py={0.5}
              borderRadius="sm"
              boxShadow="sm"
            >
              <Text
                fontSize="10px"
                fontWeight="bold"
                color={labelTextColor}
              >
                {color.shade}
              </Text>
            </Box>

            {/* Hex value */}
            <Box
              position="absolute"
              bottom={1}
              right={1}
              bg={labelBg}
              px={1.5}
              py={0.5}
              borderRadius="sm"
              boxShadow="sm"
            >
              <Text
                fontSize="10px"
                fontFamily="mono"
                fontWeight="medium"
                color={hexTextColor}
              >
                {color.hex}
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Tooltip>
  );
});

ColorSwatch.displayName = 'ColorSwatch';
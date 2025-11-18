/**
 * Color Blindness Simulator Component
 * Shows how palettes appear to users with different types of color vision deficiencies
 */

import { memo, useMemo, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Select,
  Text,
  Grid,
  Heading,
  Badge,
  useColorModeValue,
  Tooltip,
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Divider,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEye, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  simulatePaletteForColorBlindness,
  COLOR_BLINDNESS_INFO,
  type ColorBlindnessType,
  getColorBlindnessRecommendations,
} from '@/utils/colorBlindnessSimulator';
import type { ColorShades, ShadeLevel } from '@/types';

interface ColorBlindnessSimulatorProps {
  shades: ColorShades;
}

interface ShadeComparisonProps {
  level: ShadeLevel;
  originalColor: string;
  simulatedColor: string;
}

/**
 * Component to display original vs simulated color comparison
 */
const ShadeComparison = memo(({ level, originalColor, simulatedColor }: ShadeComparisonProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const differentBg = useColorModeValue('yellow.50', 'yellow.900');

  // Calculate if colors are significantly different
  const isDifferent = originalColor.toLowerCase() !== simulatedColor.toLowerCase();

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
    >
      <VStack spacing={0}>
        {/* Shade level header */}
        <Box
          w="100%"
          py={2}
          px={3}
          bg={headerBg}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="sm" fontWeight="bold" textAlign="center">
            {level}
          </Text>
        </Box>

        {/* Color comparison */}
        <HStack spacing={0} w="100%">
          {/* Original color */}
          <Tooltip label={`Original: ${originalColor}`} placement="top">
            <Box
              flex={1}
              h="80px"
              bg={originalColor}
              position="relative"
              cursor="pointer"
            >
              <Text
                position="absolute"
                bottom={2}
                left={2}
                fontSize="xs"
                px={2}
                py={1}
                bg="blackAlpha.700"
                color="white"
                borderRadius="sm"
                fontFamily="mono"
              >
                Original
              </Text>
            </Box>
          </Tooltip>

          {/* Divider */}
          <Box w="2px" h="80px" bg={borderColor} />

          {/* Simulated color */}
          <Tooltip label={`Simulated: ${simulatedColor}`} placement="top">
            <Box
              flex={1}
              h="80px"
              bg={simulatedColor}
              position="relative"
              cursor="pointer"
            >
              <Text
                position="absolute"
                bottom={2}
                right={2}
                fontSize="xs"
                px={2}
                py={1}
                bg="blackAlpha.700"
                color="white"
                borderRadius="sm"
                fontFamily="mono"
              >
                Simulated
              </Text>
            </Box>
          </Tooltip>
        </HStack>

        {/* Difference indicator */}
        {isDifferent && (
          <Box
            w="100%"
            py={1}
            px={2}
            bg={differentBg}
          >
            <Text fontSize="xs" textAlign="center" color={textColor}>
              Color shift detected
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
});

ShadeComparison.displayName = 'ShadeComparison';

/**
 * Main Color Blindness Simulator component
 */
export const ColorBlindnessSimulator = memo(({ shades }: ColorBlindnessSimulatorProps) => {
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>('deuteranomaly');
  const { isOpen: isDetailsOpen, onToggle: toggleDetails } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const selectBg = useColorModeValue('white', 'gray.800');

  // Simulate palette for selected color blindness type
  const simulatedShades = useMemo(() => {
    return simulatePaletteForColorBlindness(shades, selectedType);
  }, [shades, selectedType]);

  // Get recommendations for the palette
  const recommendations = useMemo(() => {
    return getColorBlindnessRecommendations(shades);
  }, [shades]);

  // Get info for selected type
  const selectedInfo = COLOR_BLINDNESS_INFO[selectedType];

  // Shade levels for display
  const shadeLevels: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  // Group color blindness types by category
  const typesByCategory = {
    'Red-Green': ['protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly'] as ColorBlindnessType[],
    'Blue-Yellow': ['tritanopia', 'tritanomaly'] as ColorBlindnessType[],
    'Complete': ['achromatopsia', 'achromatomaly'] as ColorBlindnessType[],
  };

  return (
    <Box bg={bgColor} p={4}>
      <VStack spacing={6} align="stretch">
        {/* Header and selector */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md" color={textColor}>
                Color Blindness Simulation
              </Heading>
              <Text fontSize="sm" color={mutedColor}>
                Preview how your palette appears to users with color vision deficiencies
              </Text>
            </VStack>
            <Icon as={FaEye} boxSize={6} color="brand.500" />
          </HStack>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ColorBlindnessType)}
            size="lg"
            bg={selectBg}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            _hover={{
              borderColor: 'brand.500',
            }}
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          >
            {Object.entries(typesByCategory).map(([category, types]) => (
              <optgroup key={category} label={category}>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {COLOR_BLINDNESS_INFO[type].name} - {COLOR_BLINDNESS_INFO[type].prevalence}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Box>

        {/* Selected type information */}
        <Box
          p={4}
          bg={useColorModeValue('blue.50', 'blue.900')}
          borderRadius="lg"
          border="1px solid"
          borderColor={useColorModeValue('blue.200', 'blue.700')}
        >
          <HStack align="start" spacing={4}>
            <Icon as={FaInfoCircle} boxSize={5} color="blue.500" mt={1} />
            <VStack align="start" spacing={2} flex={1}>
              <HStack>
                <Heading size="sm">{selectedInfo.name}</Heading>
                <Badge
                  colorScheme={
                    selectedInfo.category === 'red-green'
                      ? 'orange'
                      : selectedInfo.category === 'blue-yellow'
                      ? 'blue'
                      : 'gray'
                  }
                >
                  {selectedInfo.category.replace('-', ' ')} deficiency
                </Badge>
              </HStack>
              <Text fontSize="sm" color={mutedColor}>
                {selectedInfo.description}
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                Prevalence: {selectedInfo.prevalence}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Color comparison grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="sm" color={textColor}>
              Palette Comparison
            </Heading>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleDetails}
              rightIcon={isDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
            >
              {isDetailsOpen ? 'Hide' : 'Show'} Details
            </Button>
          </Flex>

          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              sm: 'repeat(5, 1fr)',
              lg: 'repeat(10, 1fr)',
            }}
            gap={3}
          >
            {shadeLevels.map((level) => (
              <ShadeComparison
                key={level}
                level={level}
                originalColor={shades[level]}
                simulatedColor={simulatedShades[level]}
              />
            ))}
          </Grid>
        </Box>

        {/* Detailed comparison (collapsible) */}
        <Collapse in={isDetailsOpen} animateOpacity>
          <Box
            p={4}
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderRadius="lg"
          >
            <Heading size="sm" mb={3} color={textColor}>
              Side-by-side Comparison
            </Heading>

            {/* Original palette */}
            <Box mb={4}>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color={mutedColor}>
                Original Palette
              </Text>
              <HStack spacing={2} overflowX="auto">
                {shadeLevels.map((level) => (
                  <Tooltip key={level} label={`${level}: ${shades[level]}`}>
                    <Box
                      minW="60px"
                      h="60px"
                      bg={shades[level]}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={level === 500 ? 'brand.500' : 'transparent'}
                      cursor="pointer"
                    />
                  </Tooltip>
                ))}
              </HStack>
            </Box>

            <Divider my={3} />

            {/* Simulated palette */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color={mutedColor}>
                As seen with {selectedInfo.name}
              </Text>
              <HStack spacing={2} overflowX="auto">
                {shadeLevels.map((level) => (
                  <Tooltip key={level} label={`${level}: ${simulatedShades[level]}`}>
                    <Box
                      minW="60px"
                      h="60px"
                      bg={simulatedShades[level]}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={level === 500 ? 'brand.500' : 'transparent'}
                      cursor="pointer"
                    />
                  </Tooltip>
                ))}
              </HStack>
            </Box>
          </Box>
        </Collapse>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Alert
            status="info"
            borderRadius="lg"
            variant="subtle"
          >
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold" mb={2}>
                Accessibility Recommendations
              </Text>
              <VStack align="start" spacing={1}>
                {recommendations.map((rec, index) => (
                  <Text key={index} fontSize="sm">
                    • {rec}
                  </Text>
                ))}
              </VStack>
            </Box>
          </Alert>
        )}

        {/* Additional tips */}
        <Box
          p={4}
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderRadius="lg"
          border="1px dashed"
          borderColor={useColorModeValue('gray.300', 'gray.600')}
        >
          <Heading size="sm" mb={2} color={textColor}>
            Design Tips
          </Heading>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={mutedColor}>
              • Use patterns, icons, or labels in addition to color
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              • Ensure sufficient brightness contrast between elements
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              • Test your designs with multiple color blindness simulators
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              • Consider using tools like contrast checkers alongside simulators
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
});

ColorBlindnessSimulator.displayName = 'ColorBlindnessSimulator';
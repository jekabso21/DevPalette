/**
 * GradientGenerator - Interactive gradient creation tool
 * Allows users to create custom gradients from palette colors
 */

import { useState, useMemo, useCallback, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Select,
  IconButton,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Tooltip,
  Badge,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaRandom, FaMagic } from 'react-icons/fa';
import { MdDragHandle } from 'react-icons/md';
import type { ColorShades } from '@/types';
import {
  GradientType,
  GradientConfig,
  ColorStop,
  getGradientCSS,
  generateSmoothTransition,
  suggestGradientCombinations,
} from '@/utils/gradientGenerator';

interface GradientGeneratorProps {
  shades: ColorShades;
  primaryColor: string;
  onGradientChange?: (gradient: GradientConfig) => void;
}

export const GradientGenerator = memo(({
  shades,
  primaryColor: _primaryColor,
  onGradientChange,
}: GradientGeneratorProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('gray.50', 'gray.900');

  // State
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: shades[200], position: 0 },
    { color: shades[500], position: 50 },
    { color: shades[800], position: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle');
  const [startAngle, setStartAngle] = useState(0);
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);

  // Create gradient configuration
  const gradientConfig = useMemo<GradientConfig>(() => {
    const config: GradientConfig = {
      type: gradientType,
      colors: colorStops,
      angle: gradientType === 'linear' ? angle : undefined,
      shape: gradientType === 'radial' ? radialShape : undefined,
      startAngle: gradientType === 'conic' ? startAngle : undefined,
      centerX: gradientType !== 'linear' ? centerX : undefined,
      centerY: gradientType !== 'linear' ? centerY : undefined,
    };

    // Notify parent of gradient changes
    if (onGradientChange) {
      onGradientChange(config);
    }

    return config;
  }, [gradientType, colorStops, angle, radialShape, startAngle, centerX, centerY, onGradientChange]);

  // Get gradient CSS
  const gradientCSS = useMemo(() => {
    return getGradientCSS(gradientConfig);
  }, [gradientConfig]);

  // Add color stop
  const addColorStop = useCallback(() => {
    const newPosition = colorStops.length > 0
      ? Math.min(100, colorStops[colorStops.length - 1].position + 10)
      : 50;
    const newColor = shades[500];
    setColorStops([...colorStops, { color: newColor, position: newPosition }]);
  }, [colorStops, shades]);

  // Remove color stop
  const removeColorStop = useCallback((index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  }, [colorStops]);

  // Update color stop
  const updateColorStop = useCallback((index: number, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    ));
  }, [colorStops]);

  // Apply suggested combination
  const applySuggestion = useCallback((suggestion: ColorStop[]) => {
    setColorStops(suggestion);
  }, []);

  // Generate smooth gradient
  const generateSmooth = useCallback(() => {
    if (colorStops.length >= 2) {
      const firstColor = colorStops[0].color;
      const lastColor = colorStops[colorStops.length - 1].color;
      const smoothColors = generateSmoothTransition(firstColor, lastColor, 3);
      const newStops = smoothColors.map((color, index) => ({
        color,
        position: (index / (smoothColors.length - 1)) * 100,
      }));
      setColorStops(newStops);
    }
  }, [colorStops]);

  // Randomize gradient
  const randomizeGradient = useCallback(() => {
    const availableShades = Object.values(shades);
    const numStops = Math.floor(Math.random() * 3) + 2; // 2-4 stops
    const newStops: ColorStop[] = [];

    for (let i = 0; i < numStops; i++) {
      const randomShade = availableShades[Math.floor(Math.random() * availableShades.length)];
      newStops.push({
        color: randomShade,
        position: (i / (numStops - 1)) * 100,
      });
    }

    setColorStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  }, [shades]);

  // Get suggested combinations
  const suggestions = useMemo(() => {
    return suggestGradientCombinations(shades);
  }, [shades]);

  return (
    <VStack spacing={6} align="stretch">
      {/* Gradient Type Selector */}
      <Box>
        <FormControl>
          <FormLabel color={textColor}>Gradient Type</FormLabel>
          <ButtonGroup isAttached variant="outline" width="full">
            <Button
              flex={1}
              onClick={() => setGradientType('linear')}
              bg={gradientType === 'linear' ? shades[500] : undefined}
              color={gradientType === 'linear' ? 'white' : shades[600]}
              borderColor={shades[400]}
              _hover={{ bg: gradientType === 'linear' ? shades[600] : shades[50] }}
            >
              Linear
            </Button>
            <Button
              flex={1}
              onClick={() => setGradientType('radial')}
              bg={gradientType === 'radial' ? shades[500] : undefined}
              color={gradientType === 'radial' ? 'white' : shades[600]}
              borderColor={shades[400]}
              _hover={{ bg: gradientType === 'radial' ? shades[600] : shades[50] }}
            >
              Radial
            </Button>
            <Button
              flex={1}
              onClick={() => setGradientType('conic')}
              bg={gradientType === 'conic' ? shades[500] : undefined}
              color={gradientType === 'conic' ? 'white' : shades[600]}
              borderColor={shades[400]}
              _hover={{ bg: gradientType === 'conic' ? shades[600] : shades[50] }}
            >
              Conic
            </Button>
          </ButtonGroup>
        </FormControl>
      </Box>

      {/* Gradient Preview */}
      <Box
        height="200px"
        borderRadius="xl"
        background={gradientCSS}
        boxShadow="xl"
        position="relative"
        border="2px solid"
        borderColor={borderColor}
      >
        <Box
          position="absolute"
          bottom={4}
          right={4}
          bg="blackAlpha.700"
          backdropFilter="blur(10px)"
          borderRadius="md"
          px={3}
          py={1}
        >
          <Text color="white" fontSize="sm" fontFamily="mono">
            {gradientType}
          </Text>
        </Box>
      </Box>

      {/* Gradient Controls */}
      {gradientType === 'linear' && (
        <FormControl>
          <FormLabel color={textColor}>
            <HStack justify="space-between">
              <Text>Angle</Text>
              <Badge colorScheme="purple">{angle}°</Badge>
            </HStack>
          </FormLabel>
          <Slider
            value={angle}
            onChange={setAngle}
            min={0}
            max={360}
            step={1}
          >
            <SliderTrack bg={shades[200]}>
              <SliderFilledTrack bg={shades[500]} />
            </SliderTrack>
            <SliderThumb boxSize={6} bg={shades[600]} />
          </Slider>
        </FormControl>
      )}

      {gradientType === 'radial' && (
        <>
          <FormControl>
            <FormLabel color={textColor}>Shape</FormLabel>
            <Select
              value={radialShape}
              onChange={(e) => setRadialShape(e.target.value as 'circle' | 'ellipse')}
              borderColor={shades[300]}
              _hover={{ borderColor: shades[400] }}
              _focus={{ borderColor: shades[500] }}
            >
              <option value="circle">Circle</option>
              <option value="ellipse">Ellipse</option>
            </Select>
          </FormControl>

          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>
                <HStack justify="space-between">
                  <Text>Center X</Text>
                  <Badge colorScheme="purple">{centerX}%</Badge>
                </HStack>
              </FormLabel>
              <Slider value={centerX} onChange={setCenterX} min={0} max={100}>
                <SliderTrack bg={shades[200]}>
                  <SliderFilledTrack bg={shades[500]} />
                </SliderTrack>
                <SliderThumb boxSize={6} bg={shades[600]} />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>
                <HStack justify="space-between">
                  <Text>Center Y</Text>
                  <Badge colorScheme="purple">{centerY}%</Badge>
                </HStack>
              </FormLabel>
              <Slider value={centerY} onChange={setCenterY} min={0} max={100}>
                <SliderTrack bg={shades[200]}>
                  <SliderFilledTrack bg={shades[500]} />
                </SliderTrack>
                <SliderThumb boxSize={6} bg={shades[600]} />
              </Slider>
            </FormControl>
          </SimpleGrid>
        </>
      )}

      {gradientType === 'conic' && (
        <>
          <FormControl>
            <FormLabel color={textColor}>
              <HStack justify="space-between">
                <Text>Start Angle</Text>
                <Badge colorScheme="purple">{startAngle}°</Badge>
              </HStack>
            </FormLabel>
            <Slider value={startAngle} onChange={setStartAngle} min={0} max={360}>
              <SliderTrack bg={shades[200]}>
                <SliderFilledTrack bg={shades[500]} />
              </SliderTrack>
              <SliderThumb boxSize={6} bg={shades[600]} />
            </Slider>
          </FormControl>

          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>
                <HStack justify="space-between">
                  <Text>Center X</Text>
                  <Badge colorScheme="purple">{centerX}%</Badge>
                </HStack>
              </FormLabel>
              <Slider value={centerX} onChange={setCenterX} min={0} max={100}>
                <SliderTrack bg={shades[200]}>
                  <SliderFilledTrack bg={shades[500]} />
                </SliderTrack>
                <SliderThumb boxSize={6} bg={shades[600]} />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>
                <HStack justify="space-between">
                  <Text>Center Y</Text>
                  <Badge colorScheme="purple">{centerY}%</Badge>
                </HStack>
              </FormLabel>
              <Slider value={centerY} onChange={setCenterY} min={0} max={100}>
                <SliderTrack bg={shades[200]}>
                  <SliderFilledTrack bg={shades[500]} />
                </SliderTrack>
                <SliderThumb boxSize={6} bg={shades[600]} />
              </Slider>
            </FormControl>
          </SimpleGrid>
        </>
      )}

      <Divider />

      {/* Color Stops */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading size="sm" color={textColor}>
            Color Stops
          </Heading>
          <Button
            size="sm"
            leftIcon={<FaPlus />}
            onClick={addColorStop}
            bg={shades[500]}
            color="white"
            _hover={{ bg: shades[600] }}
          >
            Add Stop
          </Button>
        </HStack>

        <VStack spacing={3} align="stretch">
          {colorStops.map((stop, index) => (
            <Box
              key={index}
              p={3}
              bg={cardBg}
              borderRadius="lg"
              borderWidth={1}
              borderColor={borderColor}
            >
              <HStack spacing={3}>
                <Icon as={MdDragHandle} color={mutedTextColor} />

                <Box
                  w={10}
                  h={10}
                  bg={stop.color}
                  borderRadius="md"
                  borderWidth={2}
                  borderColor={borderColor}
                />

                <Select
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, { color: e.target.value })}
                  size="sm"
                  flex={1}
                  borderColor={shades[300]}
                >
                  {Object.entries(shades).map(([level, color]) => (
                    <option key={level} value={color}>
                      Shade {level} - {color}
                    </option>
                  ))}
                </Select>

                <HStack spacing={1}>
                  <Text fontSize="sm" color={mutedTextColor} minW="45px">
                    {stop.position}%
                  </Text>
                  <Slider
                    value={stop.position}
                    onChange={(value) => updateColorStop(index, { position: value })}
                    min={0}
                    max={100}
                    step={1}
                    width="100px"
                  >
                    <SliderTrack h={2} bg={shades[200]}>
                      <SliderFilledTrack bg={shades[500]} />
                    </SliderTrack>
                    <SliderThumb boxSize={4} bg={shades[600]} />
                  </Slider>
                </HStack>

                <Tooltip label="Remove color stop">
                  <IconButton
                    aria-label="Remove"
                    icon={<FaTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    isDisabled={colorStops.length <= 2}
                    onClick={() => removeColorStop(index)}
                  />
                </Tooltip>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      <Divider />

      {/* Quick Actions */}
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Quick Actions
        </Heading>
        <Wrap spacing={2}>
          <WrapItem>
            <Button
              size="sm"
              leftIcon={<FaMagic />}
              onClick={generateSmooth}
              variant="outline"
              borderColor={shades[400]}
              color={shades[600]}
              _hover={{ bg: shades[50] }}
            >
              Smooth Blend
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              leftIcon={<FaRandom />}
              onClick={randomizeGradient}
              variant="outline"
              borderColor={shades[400]}
              color={shades[600]}
              _hover={{ bg: shades[50] }}
            >
              Randomize
            </Button>
          </WrapItem>
        </Wrap>
      </Box>

      {/* Suggestions */}
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Suggestions
        </Heading>
        <SimpleGrid columns={2} spacing={2}>
          {suggestions.slice(0, 4).map((suggestion, index) => (
            <Box
              key={index}
              as="button"
              h="60px"
              borderRadius="lg"
              background={getGradientCSS({
                type: 'linear',
                colors: suggestion,
                angle: 90,
              })}
              borderWidth={2}
              borderColor={borderColor}
              onClick={() => applySuggestion(suggestion)}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            />
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
});

GradientGenerator.displayName = 'GradientGenerator';
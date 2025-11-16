import { useState, useCallback, useEffect, memo } from 'react';
import {
  Box,
  HStack,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
  InputGroup,
  InputLeftAddon,
  Card,
  CardBody,
  VStack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import { FaPalette, FaRandom } from 'react-icons/fa';
import type { ColorPickerProps } from '@/types';
import { validateColor, normalizeHexColor, randomColor } from '@/utils/colorHelpers';

/**
 * Simplified, compact color picker for Phase 1
 * Side-by-side layout with color preview, hex input, and random button
 */
export const ColorPicker = memo(function ColorPicker({
  color,
  onChange,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState<string>(color);
  const [isValid, setIsValid] = useState<boolean>(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const errorColor = useColorModeValue('red.500', 'red.300');

  // Sync input value with external color prop
  useEffect(() => {
    const validation = validateColor(color);
    if (validation.isValid && validation.normalizedValue) {
      setInputValue(validation.normalizedValue);
      setIsValid(true);
    }
  }, [color]);

  /**
   * Handle color change from picker
   */
  const handleColorChange = useCallback(
    (newColor: string) => {
      const normalized = normalizeHexColor(newColor);
      setInputValue(normalized);
      setIsValid(true);
      onChange(normalized);
    },
    [onChange]
  );

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.length > 0) {
        const validation = validateColor(value);
        setIsValid(validation.isValid);

        if (validation.isValid && validation.normalizedValue) {
          onChange(validation.normalizedValue);
        }
      } else {
        setIsValid(false);
      }
    },
    [onChange]
  );

  /**
   * Handle input blur - normalize color if valid
   */
  const handleInputBlur = useCallback(() => {
    if (isValid && inputValue) {
      const validation = validateColor(inputValue);
      if (validation.isValid && validation.normalizedValue) {
        setInputValue(validation.normalizedValue);
      }
    }
  }, [inputValue, isValid]);

  /**
   * Generate random color
   */
  const handleRandomColor = useCallback(() => {
    const newColor = randomColor({ luminosity: 'bright' });
    setInputValue(newColor);
    setIsValid(true);
    onChange(newColor);
  }, [onChange]);

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      variant="outline"
      maxW="500px"
      w="100%"
      overflow="visible"
    >
      <CardBody>
        <HStack spacing={4} align="center">
          {/* Color Preview and Picker */}
          <Popover placement="bottom-start" isLazy>
            <PopoverTrigger>
              <Box
                as="button"
                width="80px"
                height="80px"
                minW="80px"
                borderRadius="lg"
                bg={isValid ? inputValue : 'gray.500'}
                border="3px solid"
                borderColor={isValid ? borderColor : errorColor}
                cursor="pointer"
                transition="all 0.2s"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'lg',
                }}
                _focus={{
                  outline: 'none',
                  boxShadow: '0 0 0 3px',
                  boxShadowColor: 'brand.200',
                }}
                aria-label="Open color picker"
              >
                <Box
                  position="absolute"
                  bottom={1}
                  right={1}
                  bg="blackAlpha.600"
                  borderRadius="sm"
                  p={1}
                >
                  <FaPalette size={10} color="white" />
                </Box>
              </Box>
            </PopoverTrigger>
            <PopoverContent width="auto" bg={bgColor} borderColor={borderColor}>
              <PopoverBody p={4}>
                <VStack spacing={3}>
                  <HexColorPicker
                    color={isValid ? inputValue : '#84CC16'}
                    onChange={handleColorChange}
                    style={{ width: '240px', height: '200px' }}
                  />
                  <Text fontSize="xs" color="gray.500">
                    Click and drag to select a color
                  </Text>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Right side: Input and Random Button */}
          <VStack align="stretch" flex={1} spacing={2}>
            {/* Hex Input */}
            <InputGroup size="lg">
              <InputLeftAddon bg={useColorModeValue('gray.50', 'gray.700')}>
                #
              </InputLeftAddon>
              <Input
                value={inputValue.replace('#', '')}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: { ...e.target, value: '#' + e.target.value },
                } as React.ChangeEvent<HTMLInputElement>)}
                onBlur={handleInputBlur}
                placeholder="84CC16"
                fontFamily="mono"
                textTransform="uppercase"
                maxLength={6}
                borderColor={!isValid ? errorColor : undefined}
                _focus={{
                  borderColor: isValid ? 'brand.400' : errorColor,
                  boxShadow: isValid ? '0 0 0 1px' : '0 0 0 1px',
                  boxShadowColor: isValid ? 'brand.400' : errorColor,
                }}
                aria-label="Hex color code"
                aria-invalid={!isValid}
              />
            </InputGroup>

            {/* Random Button */}
            <Tooltip label="Generate a random color" placement="bottom">
              <Button
                leftIcon={<FaRandom />}
                onClick={handleRandomColor}
                variant="outline"
                colorScheme="brand"
                size="sm"
                w="100%"
                _hover={{
                  bg: useColorModeValue('brand.50', 'brand.900'),
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm',
                }}
                transition="all 0.2s"
              >
                Random Color
              </Button>
            </Tooltip>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
});

ColorPicker.displayName = 'ColorPicker';
import { useState, useCallback, useEffect, memo } from 'react';
import {
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
 * Enhanced color picker with improved visual design
 * Clean, modern interface with better visual hierarchy
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
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');

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
    <VStack spacing={4} align="stretch" w="100%">
      {/* Color Picker Card */}
      <Card
        bg={bgColor}
        borderColor={borderColor}
        variant="outline"
        w="100%"
        overflow="visible"
        boxShadow="sm"
        _hover={{
          boxShadow: 'md',
          borderColor: 'brand.400',
        }}
        transition="all 0.2s"
      >
        <CardBody p={4}>
          <VStack spacing={4} align="stretch">
            {/* Color Picker Trigger */}
            <Popover placement="bottom" isLazy>
              <PopoverTrigger>
                <Button
                  size="lg"
                  variant="outline"
                  w="100%"
                  h="60px"
                  leftIcon={<FaPalette size={20} />}
                  borderColor={borderColor}
                  bg={useColorModeValue('white', 'gray.700')}
                  _hover={{
                    bg: useColorModeValue('gray.50', 'gray.600'),
                    borderColor: 'brand.400',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm" fontWeight="normal" color={textColor}>
                      Color Picker
                    </Text>
                    <Text fontSize="md" fontWeight="bold" fontFamily="mono" color={headingColor}>
                      {isValid ? inputValue : 'Select Color'}
                    </Text>
                  </VStack>
                </Button>
              </PopoverTrigger>
              <PopoverContent width="auto" bg={bgColor} borderColor={borderColor} boxShadow="xl">
                <PopoverBody p={4}>
                  <VStack spacing={3}>
                    <HexColorPicker
                      color={isValid ? inputValue : '#84CC16'}
                      onChange={handleColorChange}
                      style={{ width: '280px', height: '240px' }}
                    />
                    <Text fontSize="xs" color="gray.500">
                      Click and drag to select a color
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            {/* Hex Input */}
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xs" fontWeight="semibold" color={textColor} textTransform="uppercase">
                Hex Code
              </Text>
              <InputGroup size="lg">
                <InputLeftAddon
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderColor={!isValid ? errorColor : borderColor}
                >
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
                  borderColor={!isValid ? errorColor : borderColor}
                  bg={useColorModeValue('white', 'gray.700')}
                  _focus={{
                    borderColor: isValid ? 'brand.400' : errorColor,
                    boxShadow: 'none',
                    bg: useColorModeValue('white', 'gray.600'),
                  }}
                  _hover={{
                    borderColor: isValid ? 'brand.300' : errorColor,
                  }}
                  aria-label="Hex color code"
                  aria-invalid={!isValid}
                />
              </InputGroup>
              {!isValid && (
                <Text fontSize="xs" color={errorColor}>
                  Please enter a valid hex color code
                </Text>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Random Color Button */}
      <Tooltip label="Generate a random color" placement="bottom">
        <Button
          leftIcon={<FaRandom />}
          onClick={handleRandomColor}
          variant="solid"
          colorScheme="brand"
          size="lg"
          w="100%"
          h="60px"
          fontSize="md"
          fontWeight="bold"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          _active={{
            transform: 'translateY(0)',
          }}
          transition="all 0.2s"
        >
          Generate Random Color
        </Button>
      </Tooltip>
    </VStack>
  );
});

ColorPicker.displayName = 'ColorPicker';
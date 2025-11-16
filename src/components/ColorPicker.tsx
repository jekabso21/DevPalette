import { useState, useCallback, useEffect, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { FaEyeDropper, FaRandom } from 'react-icons/fa';
import type { ColorPickerProps } from '@/types';
import { validateColor, normalizeHexColor, randomColor } from '@/utils/colorHelpers';

/**
 * Color picker component using react-colorful with Chakra UI
 * Includes hex input field with validation and visual preview
 */
export const ColorPicker = memo(function ColorPicker({
  color,
  onChange,
  label = 'Primary Color',
  placeholder = '#84CC16',
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState<string>(color);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  // Sync input value with external color prop
  useEffect(() => {
    const validation = validateColor(color);
    if (validation.isValid && validation.normalizedValue) {
      setInputValue(validation.normalizedValue);
      setIsValid(true);
      setErrorMessage('');
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
      setErrorMessage('');
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

      // Validate on every change
      if (value.length > 0) {
        const validation = validateColor(value);
        setIsValid(validation.isValid);

        if (validation.isValid && validation.normalizedValue) {
          setErrorMessage('');
          onChange(validation.normalizedValue);
        } else {
          setErrorMessage(validation.error || 'Invalid color format');
        }
      } else {
        setIsValid(false);
        setErrorMessage('Color is required');
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
    setErrorMessage('');
    onChange(newColor);
  }, [onChange]);

  /**
   * Handle paste event
   */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');

      const validation = validateColor(pastedText);
      if (validation.isValid && validation.normalizedValue) {
        setInputValue(validation.normalizedValue);
        setIsValid(true);
        setErrorMessage('');
        onChange(validation.normalizedValue);
      } else {
        setInputValue(pastedText);
        setIsValid(false);
        setErrorMessage(validation.error || 'Invalid color format');
      }
    },
    [onChange]
  );

  return (
    <VStack spacing={4} align="stretch" width="100%" maxW="400px">
      {/* Label */}
      <Text fontSize="lg" fontWeight="semibold" color={textColor}>
        {label}
      </Text>

      {/* Color Preview and Picker */}
      <HStack spacing={3} align="stretch">
        {/* Color Preview Box */}
        <Popover placement="bottom-start" isLazy>
          <PopoverTrigger>
            <Box
              as="button"
              width="80px"
              height="80px"
              borderRadius="lg"
              bg={isValid ? inputValue : 'gray.500'}
              border="3px solid"
              borderColor={borderColor}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
              _focus={{
                outline: 'none',
                boxShadow: 'outline',
              }}
              aria-label="Open color picker"
              position="relative"
              overflow="hidden"
            >
              {!isValid && (
                <Box
                  position="absolute"
                  inset={0}
                  bg="repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)"
                />
              )}
              <Flex
                position="absolute"
                bottom={1}
                right={1}
                bg="blackAlpha.600"
                borderRadius="sm"
                px={1}
              >
                <FaEyeDropper size={12} color="white" />
              </Flex>
            </Box>
          </PopoverTrigger>
          <PopoverContent width="auto" bg={bgColor} borderColor={borderColor}>
            <PopoverArrow bg={bgColor} />
            <PopoverCloseButton />
            <PopoverBody p={4}>
              <VStack spacing={3}>
                <HexColorPicker
                  color={isValid ? inputValue : '#84CC16'}
                  onChange={handleColorChange}
                  style={{ width: '240px', height: '200px' }}
                />
                <HexColorInput
                  color={isValid ? inputValue : '#84CC16'}
                  onChange={handleColorChange}
                  prefixed
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${borderColor}`,
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                  aria-label="Hex color input in picker"
                />
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Input Field */}
        <FormControl isInvalid={!isValid} flex={1}>
          <FormLabel srOnly>{label} hex value</FormLabel>
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
              onPaste={handlePaste}
              placeholder={placeholder.replace('#', '')}
              fontFamily="mono"
              textTransform="uppercase"
              maxLength={6}
              aria-label={`${label} hex color code`}
              aria-invalid={!isValid}
              aria-describedby={!isValid ? 'color-error' : undefined}
            />
          </InputGroup>
          {!isValid && (
            <FormErrorMessage id="color-error" fontSize="sm">
              {errorMessage}
            </FormErrorMessage>
          )}
        </FormControl>
      </HStack>

      {/* Action Buttons */}
      <HStack spacing={2}>
        <Button
          leftIcon={<FaRandom />}
          onClick={handleRandomColor}
          variant="outline"
          size="sm"
          colorScheme="brand"
          aria-label="Generate random color"
        >
          Random
        </Button>
        {isValid && (
          <Text fontSize="sm" color={textColor} fontFamily="mono">
            {inputValue.toUpperCase()}
          </Text>
        )}
      </HStack>
    </VStack>
  );
});

ColorPicker.displayName = 'ColorPicker';
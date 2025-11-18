/**
 * ExportPanel component - Main export interface
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaDownload, FaMagic } from 'react-icons/fa';
import { saveAs } from 'file-saver';

import { ColorShades, ExportFormat } from '../../types';
import {
  formatTailwind,
  formatCSS,
  formatSCSS,
  formatJavaScript,
  formatFigma,
  generateFilename,
  getMimeType,
} from '../../utils/exportFormatters';
import {
  suggestColorName,
  sanitizeColorName,
  isValidColorName,
  formatColorNameForDisplay,
} from '../../utils/semanticNaming';
import { FormatSelector } from './FormatSelector';
import { CodePreview } from './CodePreview';

interface ExportPanelProps {
  shades: ColorShades;
  primaryColor: string;
  onClose?: () => void;
}

export const ExportPanel = ({ shades, primaryColor, onClose }: ExportPanelProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('tailwind');
  const [colorName, setColorName] = useState('primary');
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const toast = useToast();
  const inputBg = useColorModeValue('white', 'gray.800');
  const tagScheme = useColorModeValue('purple', 'purple');

  // Get suggested names when primary color changes
  useEffect(() => {
    const suggestions = suggestColorName(primaryColor);
    setSuggestedNames(suggestions);

    // Set the first suggestion as default if current name is 'primary'
    if (colorName === 'primary' && suggestions.length > 0) {
      setColorName(suggestions[0]);
    }
  }, [primaryColor, colorName]);

  // Format the code based on selected format
  const formattedCode = useMemo(() => {
    const sanitized = sanitizeColorName(colorName);

    switch (selectedFormat) {
      case 'tailwind':
        return formatTailwind(shades, sanitized);
      case 'css':
        return formatCSS(shades, sanitized);
      case 'scss':
        return formatSCSS(shades, sanitized);
      case 'javascript':
        return formatJavaScript(shades, sanitized);
      case 'figma':
        return formatFigma(shades, sanitized);
      default:
        return '';
    }
  }, [selectedFormat, shades, colorName]);

  // Handle color name change
  const handleColorNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorName(value);
  }, []);

  // Apply suggested name
  const applySuggestedName = useCallback((name: string) => {
    setColorName(name);
    toast({
      title: 'Name applied',
      description: `Color name set to "${formatColorNameForDisplay(name)}"`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  }, [toast]);

  // Download the palette file
  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);

      const sanitized = sanitizeColorName(colorName);
      const filename = generateFilename(selectedFormat, sanitized);
      const mimeType = getMimeType(selectedFormat);
      const blob = new Blob([formattedCode], { type: mimeType });

      saveAs(blob, filename);

      toast({
        title: 'Download started',
        description: `Palette exported as ${filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download the palette file',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    } finally {
      setIsDownloading(false);
    }
  }, [colorName, selectedFormat, formattedCode, toast]);

  // Get language for syntax highlighting
  const getLanguage = useCallback((format: ExportFormat): string => {
    switch (format) {
      case 'tailwind':
      case 'javascript':
        return 'javascript';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'figma':
        return 'json';
      default:
        return 'text';
    }
  }, []);

  const isNameValid = isValidColorName(colorName);

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Color Name Input */}
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="semibold">
          Color Name
        </FormLabel>
        <InputGroup size="md">
          <InputLeftAddon>#</InputLeftAddon>
          <Input
            value={colorName}
            onChange={handleColorNameChange}
            placeholder="Enter color name"
            bg={inputBg}
            isInvalid={!isNameValid && colorName.length > 0}
            aria-label="Color name for export"
            spellCheck={false}
          />
        </InputGroup>
        {!isNameValid && colorName.length > 0 && (
          <Text fontSize="xs" color="red.500" mt={1}>
            Name must start with a letter and contain only letters, numbers, hyphens, or underscores
          </Text>
        )}
      </FormControl>

      {/* Suggested Names */}
      {suggestedNames.length > 0 && (
        <Box>
          <HStack mb={2}>
            <FaMagic size={12} />
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase">
              Suggested Names
            </Text>
          </HStack>
          <Wrap spacing={2}>
            {suggestedNames.map((name) => (
              <WrapItem key={name}>
                <Tag
                  size="md"
                  colorScheme={colorName === name ? 'brand' : tagScheme}
                  variant={colorName === name ? 'solid' : 'subtle'}
                  cursor="pointer"
                  onClick={() => applySuggestedName(name)}
                  _hover={{
                    transform: 'translateY(-1px)',
                    shadow: 'sm',
                  }}
                  transition="all 0.2s"
                  aria-label={`Apply suggested name: ${name}`}
                >
                  <TagLabel>{formatColorNameForDisplay(name)}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {/* Format Selector */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3}>
          Export Format
        </Text>
        <FormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />
      </Box>

      {/* Code Preview */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3}>
          Preview
        </Text>
        <CodePreview
          code={formattedCode}
          language={getLanguage(selectedFormat)}
          maxHeight="300px"
        />
      </Box>

      {/* Export Actions */}
      <HStack spacing={3} justify="flex-end">
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          leftIcon={<FaDownload />}
          colorScheme="brand"
          onClick={handleDownload}
          isLoading={isDownloading}
          loadingText="Downloading..."
          isDisabled={!isNameValid || colorName.length === 0}
          size="md"
        >
          Download File
        </Button>
      </HStack>
    </VStack>
  );
};
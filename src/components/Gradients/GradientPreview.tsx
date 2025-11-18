/**
 * GradientPreview - Display and export gradient with code output
 * Shows large preview area and provides multiple export formats
 */

import { useState, useMemo, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useColorModeValue,
  useToast,
  IconButton,
  Select,
  FormControl,
  FormLabel,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaCopy, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import type { GradientConfig } from '@/utils/gradientGenerator';
import { getGradientCSS, exportGradientCode } from '@/utils/gradientGenerator';

interface GradientPreviewProps {
  gradient: GradientConfig;
  name?: string;
}

export const GradientPreview = memo(({ gradient, name = 'gradient' }: GradientPreviewProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const codeBg = useColorModeValue('gray.50', 'gray.900');

  const toast = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'scss'>('css');

  // Generate gradient CSS
  const gradientCSS = useMemo(() => {
    return getGradientCSS(gradient);
  }, [gradient]);

  // Generate code for different formats
  const codeFormats = useMemo(() => {
    const cssCode = exportGradientCode(gradient, 'css');
    const tailwindCode = exportGradientCode(gradient, 'tailwind');
    const scssCode = exportGradientCode(gradient, 'scss');

    // Additional formats
    const cssVarCode = `:root {
  --gradient-${name}: ${gradientCSS};
}

.gradient-${name} {
  background: var(--gradient-${name});
}`;

    const jsCode = `const gradient = {
  type: '${gradient.type}',
  colors: ${JSON.stringify(gradient.colors, null, 2)},${gradient.angle !== undefined ? `\n  angle: ${gradient.angle},` : ''}${gradient.shape !== undefined ? `\n  shape: '${gradient.shape}',` : ''}${gradient.startAngle !== undefined ? `\n  startAngle: ${gradient.startAngle},` : ''}
  cssValue: '${gradientCSS}'
};`;

    const reactCode = `const gradientStyle = {
  background: '${gradientCSS}'
};

// Usage
<Box style={gradientStyle}>
  {/* Your content */}
</Box>`;

    return {
      css: cssCode,
      tailwind: tailwindCode,
      scss: scssCode,
      cssVar: cssVarCode,
      js: jsCode,
      react: reactCode,
    };
  }, [gradient, gradientCSS, name]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${format} code copied to clipboard`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Download as file
  const downloadAsFile = () => {
    const content = `/* Generated Gradient - ${name} */\n\n` +
      `/* CSS */\n${codeFormats.css}\n\n` +
      `/* CSS Variables */\n${codeFormats.cssVar}\n\n` +
      `/* SCSS */\n${codeFormats.scss}\n\n` +
      `/* Tailwind CSS */\n/* ${codeFormats.tailwind} */\n\n` +
      `/* JavaScript */\n${codeFormats.js}\n\n` +
      `/* React */\n${codeFormats.react}`;

    const blob = new Blob([content], { type: 'text/css' });
    saveAs(blob, `gradient-${name}.css`);

    toast({
      title: 'Downloaded!',
      description: 'Gradient code saved as CSS file',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Preview Area */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Heading size="sm" color={textColor}>
            Preview
          </Heading>
          <IconButton
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            icon={isFullscreen ? <FaCompress /> : <FaExpand />}
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </HStack>

        <Box
          height={isFullscreen ? '400px' : '250px'}
          borderRadius="xl"
          background={gradientCSS}
          boxShadow="2xl"
          position="relative"
          border="2px solid"
          borderColor={borderColor}
          transition="height 0.3s"
        >
          {/* Gradient Info Overlay */}
          <Box
            position="absolute"
            bottom={4}
            left={4}
            right={4}
            bg="blackAlpha.700"
            backdropFilter="blur(10px)"
            borderRadius="lg"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <HStack>
                <Badge colorScheme="purple" fontSize="xs">
                  {gradient.type}
                </Badge>
                {gradient.angle !== undefined && (
                  <Badge colorScheme="blue" fontSize="xs">
                    {gradient.angle}°
                  </Badge>
                )}
                {gradient.shape && (
                  <Badge colorScheme="green" fontSize="xs">
                    {gradient.shape}
                  </Badge>
                )}
              </HStack>
              <Text color="white" fontSize="xs" fontFamily="mono" opacity={0.9}>
                {gradient.colors.length} color stops
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Export Controls */}
      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontSize="sm" color={textColor}>
            Export Format
          </FormLabel>
          <Select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'css' | 'tailwind' | 'scss')}
            size="sm"
            borderColor={borderColor}
          >
            <option value="css">CSS</option>
            <option value="tailwind">Tailwind CSS</option>
            <option value="scss">SCSS</option>
          </Select>
        </FormControl>

        <Button
          leftIcon={<FaDownload />}
          size="sm"
          colorScheme="brand"
          onClick={downloadAsFile}
          mt={7}
        >
          Download All
        </Button>
      </HStack>

      {/* Code Output */}
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Code Output
        </Heading>

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab fontSize="sm">CSS</Tab>
            <Tab fontSize="sm">CSS Variables</Tab>
            <Tab fontSize="sm">Tailwind</Tab>
            <Tab fontSize="sm">SCSS</Tab>
            <Tab fontSize="sm">JavaScript</Tab>
            <Tab fontSize="sm">React</Tab>
          </TabList>

          <TabPanels>
            {/* CSS Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy CSS"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.css, 'CSS')}
                />
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontSize="sm"
                  color={textColor}
                  bg="transparent"
                >
                  {codeFormats.css}
                </Code>
              </Box>
            </TabPanel>

            {/* CSS Variables Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy CSS Variables"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.cssVar, 'CSS Variables')}
                />
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontSize="sm"
                  color={textColor}
                  bg="transparent"
                >
                  {codeFormats.cssVar}
                </Code>
              </Box>
            </TabPanel>

            {/* Tailwind Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy Tailwind"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.tailwind, 'Tailwind')}
                />
                <VStack align="start" spacing={3}>
                  <Text fontSize="xs" color={mutedTextColor}>
                    Use arbitrary values in Tailwind CSS:
                  </Text>
                  <Code
                    display="block"
                    whiteSpace="pre"
                    fontSize="sm"
                    color={textColor}
                    bg="transparent"
                  >
                    {codeFormats.tailwind}
                  </Code>
                </VStack>
              </Box>
            </TabPanel>

            {/* SCSS Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy SCSS"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.scss, 'SCSS')}
                />
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontSize="sm"
                  color={textColor}
                  bg="transparent"
                >
                  {codeFormats.scss}
                </Code>
              </Box>
            </TabPanel>

            {/* JavaScript Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy JavaScript"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.js, 'JavaScript')}
                />
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontSize="sm"
                  color={textColor}
                  bg="transparent"
                >
                  {codeFormats.js}
                </Code>
              </Box>
            </TabPanel>

            {/* React Tab */}
            <TabPanel p={0}>
              <Box
                bg={codeBg}
                p={4}
                borderRadius="md"
                borderWidth={1}
                borderColor={borderColor}
                position="relative"
              >
                <IconButton
                  aria-label="Copy React"
                  icon={<FaCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => copyToClipboard(codeFormats.react, 'React')}
                />
                <Code
                  display="block"
                  whiteSpace="pre"
                  fontSize="sm"
                  color={textColor}
                  bg="transparent"
                >
                  {codeFormats.react}
                </Code>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Gradient Details */}
      <Box
        p={4}
        bg={codeBg}
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
      >
        <Heading size="xs" color={textColor} mb={3}>
          Gradient Details
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <HStack>
            <Text fontSize="sm" color={mutedTextColor}>Type:</Text>
            <Badge colorScheme="purple">{gradient.type}</Badge>
          </HStack>
          {gradient.angle !== undefined && (
            <HStack>
              <Text fontSize="sm" color={mutedTextColor}>Angle:</Text>
              <Badge colorScheme="blue">{gradient.angle}°</Badge>
            </HStack>
          )}
          {gradient.shape && (
            <HStack>
              <Text fontSize="sm" color={mutedTextColor}>Shape:</Text>
              <Badge colorScheme="green">{gradient.shape}</Badge>
            </HStack>
          )}
          {gradient.startAngle !== undefined && (
            <HStack>
              <Text fontSize="sm" color={mutedTextColor}>Start Angle:</Text>
              <Badge colorScheme="orange">{gradient.startAngle}°</Badge>
            </HStack>
          )}
          <HStack>
            <Text fontSize="sm" color={mutedTextColor}>Stops:</Text>
            <Badge>{gradient.colors.length}</Badge>
          </HStack>
        </SimpleGrid>

        {/* Color Stops List */}
        <VStack align="start" spacing={2} mt={4}>
          <Text fontSize="xs" fontWeight="bold" color={mutedTextColor}>
            Color Stops:
          </Text>
          {gradient.colors.map((stop, index) => (
            <HStack key={index} spacing={3}>
              <Box
                w={4}
                h={4}
                bg={stop.color}
                borderRadius="sm"
                borderWidth={1}
                borderColor={borderColor}
              />
              <Text fontSize="xs" fontFamily="mono" color={textColor}>
                {stop.color}
              </Text>
              <Badge size="sm" colorScheme="gray">
                {stop.position}%
              </Badge>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
});

GradientPreview.displayName = 'GradientPreview';
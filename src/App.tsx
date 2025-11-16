import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Divider,
  useColorModeValue,
  Grid,
  GridItem,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  HStack,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPalette, FaHistory, FaBookmark } from 'react-icons/fa';
import { Header } from '@/components/Header';
import { ColorPicker } from '@/components/ColorPicker';
import { SchemeDisplay } from '@/components/ColorSchemes/SchemeDisplay';
import { generateShades } from '@/utils/shadeGenerator';
import type { ColorShades, ColorSwatchData } from '@/types';

/**
 * Main application component
 * Orchestrates the color palette generation and display
 */
function App() {
  // State management
  const [primaryColor, setPrimaryColor] = useState<string>('#84CC16');
  const [history, setHistory] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Array<{ color: string; shades: ColorShades }>>([]);

  const { isOpen: showHistory, onToggle: toggleHistory } = useDisclosure();
  const { isOpen: showSaved, onToggle: toggleSaved } = useDisclosure();

  // Theme values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Generate color shades
  const colorShades = useMemo<ColorShades>(() => {
    return generateShades(primaryColor);
  }, [primaryColor]);

  /**
   * Handle primary color change
   */
  const handleColorChange = useCallback((newColor: string) => {
    setPrimaryColor(newColor);

    // Add to history (limit to last 10)
    setHistory((prev) => {
      const updated = [newColor, ...prev.filter(c => c !== newColor)];
      return updated.slice(0, 10);
    });
  }, []);

  /**
   * Handle color swatch click
   */
  const handleSwatchClick = useCallback((color: ColorSwatchData) => {
    console.log('Swatch clicked:', color);
    // Additional handling can be added here
  }, []);

  /**
   * Save current palette
   */
  const savePalette = useCallback(() => {
    setSavedPalettes((prev) => {
      const exists = prev.some(p => p.color === primaryColor);
      if (exists) return prev;

      const updated = [{ color: primaryColor, shades: colorShades }, ...prev];
      return updated.slice(0, 5); // Keep only 5 saved palettes
    });
  }, [primaryColor, colorShades]);

  /**
   * Load a saved palette
   */
  const loadPalette = useCallback((color: string) => {
    setPrimaryColor(color);
  }, []);

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Hero Section */}
          <VStack spacing={4} align="center" textAlign="center" py={8}>
            <Heading
              as="h2"
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
              fontWeight="bold"
            >
              Create Beautiful Color Palettes
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="600px">
              Generate professional color schemes with automatic shade generation.
              Perfect for design systems, UI development, and branding.
            </Text>
          </VStack>

          {/* Main Grid Layout */}
          <Grid
            templateColumns={{ base: '1fr', lg: '400px 1fr' }}
            gap={8}
          >
            {/* Left Sidebar - Controls */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Color Picker Card */}
                <Card bg={cardBg} borderColor={borderColor} variant="outline">
                  <CardBody>
                    <ColorPicker
                      color={primaryColor}
                      onChange={handleColorChange}
                      label="Choose Primary Color"
                      placeholder="#84CC16"
                    />

                    <Button
                      mt={4}
                      size="sm"
                      variant="outline"
                      leftIcon={<FaBookmark />}
                      onClick={savePalette}
                      colorScheme="brand"
                      width="full"
                    >
                      Save Palette
                    </Button>
                  </CardBody>
                </Card>

                {/* History Section */}
                <Card bg={cardBg} borderColor={borderColor} variant="outline">
                  <CardBody>
                    <HStack justify="space-between" mb={3}>
                      <HStack>
                        <FaHistory color={textColor} />
                        <Text fontWeight="semibold" color={headingColor}>
                          Recent Colors
                        </Text>
                      </HStack>
                      <Badge colorScheme="brand">{history.length}</Badge>
                    </HStack>

                    <Collapse in={history.length > 0} animateOpacity>
                      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                        {history.slice(0, 10).map((color, index) => (
                          <Box
                            key={`${color}-${index}`}
                            as="button"
                            w="full"
                            h="40px"
                            bg={color}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={borderColor}
                            onClick={() => handleColorChange(color)}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                              transform: 'scale(1.1)',
                              boxShadow: 'md',
                            }}
                            aria-label={`Use color ${color}`}
                          />
                        ))}
                      </Grid>
                    </Collapse>

                    {history.length === 0 && (
                      <Text fontSize="sm" color={textColor}>
                        No recent colors yet
                      </Text>
                    )}
                  </CardBody>
                </Card>

                {/* Saved Palettes */}
                {savedPalettes.length > 0 && (
                  <Card bg={cardBg} borderColor={borderColor} variant="outline">
                    <CardBody>
                      <HStack justify="space-between" mb={3}>
                        <HStack>
                          <FaBookmark color={textColor} />
                          <Text fontWeight="semibold" color={headingColor}>
                            Saved Palettes
                          </Text>
                        </HStack>
                        <Badge colorScheme="brand">{savedPalettes.length}</Badge>
                      </HStack>

                      <VStack spacing={2} align="stretch">
                        {savedPalettes.map((palette, index) => (
                          <HStack
                            key={`${palette.color}-${index}`}
                            p={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={borderColor}
                            cursor="pointer"
                            onClick={() => loadPalette(palette.color)}
                            _hover={{
                              bg: useColorModeValue('gray.50', 'gray.700'),
                            }}
                          >
                            <Box
                              w="30px"
                              h="30px"
                              bg={palette.color}
                              borderRadius="md"
                              border="1px solid"
                              borderColor={borderColor}
                            />
                            <Text fontSize="sm" fontFamily="mono">
                              {palette.color}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </GridItem>

            {/* Right Content - Color Display */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Main Palette Display */}
                <SchemeDisplay
                  primaryColor={primaryColor}
                  shades={colorShades}
                  onColorClick={handleSwatchClick}
                  showLabels={true}
                />

                {/* Additional Features Tabs */}
                <Card bg={cardBg} borderColor={borderColor} variant="outline">
                  <CardBody>
                    <Tabs colorScheme="brand" variant="soft-rounded">
                      <TabList>
                        <Tab>
                          <HStack spacing={2}>
                            <FaPalette />
                            <Text>Variations</Text>
                          </HStack>
                        </Tab>
                        <Tab>Usage</Tab>
                        <Tab>Export</Tab>
                      </TabList>

                      <TabPanels mt={4}>
                        <TabPanel>
                          <VStack spacing={4} align="stretch">
                            <Text color={textColor}>
                              Color variations and alternative generation methods coming in Phase 2.
                            </Text>
                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
                              <Text fontSize="sm" color={textColor}>
                                • Analogous colors
                                • Complementary schemes
                                • Triadic combinations
                                • Tetradic palettes
                              </Text>
                            </Box>
                          </VStack>
                        </TabPanel>

                        <TabPanel>
                          <VStack spacing={4} align="stretch">
                            <Text fontWeight="semibold" color={headingColor}>
                              How to Use Your Palette
                            </Text>
                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
                              <VStack spacing={2} align="start">
                                <Text fontSize="sm" color={textColor}>
                                  <strong>50-200:</strong> Background colors, subtle fills
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  <strong>300-400:</strong> Borders, dividers, secondary elements
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  <strong>500:</strong> Primary brand color, buttons, links
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  <strong>600-700:</strong> Hover states, active elements
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  <strong>800-900:</strong> Text, dark backgrounds
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        </TabPanel>

                        <TabPanel>
                          <VStack spacing={4} align="stretch">
                            <Text color={textColor}>
                              Click the export buttons in the palette display to copy your colors as:
                            </Text>
                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
                              <VStack spacing={2} align="start">
                                <Text fontSize="sm" color={textColor}>
                                  • CSS Variables
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  • JSON Object
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  • Tailwind Configuration
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>
          </Grid>

          {/* Footer */}
          <Divider />
          <VStack spacing={2} py={4}>
            <Text fontSize="sm" color={textColor} textAlign="center">
              DevPalette v0.1.0 - Professional Color Palette Generator
            </Text>
            <Text fontSize="xs" color={textColor} textAlign="center">
              Built with React, TypeScript, and Chakra UI
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
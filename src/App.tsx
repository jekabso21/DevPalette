import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  Text,
  useColorModeValue,
  Heading,
  Fade,
  ScaleFade,
  Container,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { FaDownload, FaUniversalAccess, FaEye } from 'react-icons/fa';
import { Header } from '@/components/Header';
import { ColorPicker } from '@/components/ColorPicker';
import { PaletteSectionVariations } from '@/components/ColorSchemes/PaletteSectionVariations';
import { ExportPanel } from '@/components/Export/ExportPanel';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';
import { ComponentGradientPanel } from '@/components/Preview/ComponentGradientPanel';
import { generateAllPaletteVariations } from '@/utils/colorGeneratorVariations';
import { generateShades } from '@/utils/shadeGenerator';
import type { PaletteType, PaletteWithVariations, ColorShades } from '@/types';

/**
 * Main application component - Enhanced with multiple palette variations
 * Full-page layout with extensive color palette options
 */
function App() {
  // Single state: the selected color
  const [primaryColor, setPrimaryColor] = useState<string>('#84CC16');

  // Export modal state
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();

  // Accessibility modal state
  const { isOpen: isAccessibilityOpen, onOpen: onAccessibilityOpen, onClose: onAccessibilityClose } = useDisclosure();

  // Preview & Gradients modal state
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  // Theme values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Generate all color palette variations whenever primary color changes
  const palettes = useMemo<Record<PaletteType, PaletteWithVariations>>(() => {
    return generateAllPaletteVariations(primaryColor);
  }, [primaryColor]);

  // Generate shades for export
  const shades = useMemo<ColorShades>(() => {
    return generateShades(primaryColor);
  }, [primaryColor]);

  // Order of palettes to display
  const paletteOrder: PaletteType[] = [
    'monochromatic',
    'analogous',
    'complementary',
    'triadic',
    'split-complementary',
    'tetradic',
  ];

  return (
    <Box minH="100vh" bg={bgColor} display="flex" flexDirection="column">
      {/* Sticky Header */}
      <Header />

      {/* Main Content - Full Height */}
      <Box flex={1} overflow="hidden">
        <Grid
          templateColumns={{ base: '1fr', lg: '400px 1fr' }}
          h="100%"
        >
          {/* Left Sidebar - Color Input */}
          <GridItem
            bg={sidebarBg}
            borderRight="1px"
            borderColor={borderColor}
            p={{ base: 4, md: 6 }}
            overflowY="auto"
            display="flex"
            flexDirection="column"
          >
            <VStack spacing={6} align="stretch" h="100%">
              {/* Section Title */}
              <ScaleFade initialScale={0.9} in={true}>
                <VStack align="start" spacing={2}>
                  <Heading size="lg" color={headingColor}>
                    Color Selection
                  </Heading>
                  <Text fontSize="sm" color={textColor}>
                    Choose your base color to generate multiple palette variations
                  </Text>
                </VStack>
              </ScaleFade>

              {/* Large Color Preview */}
              <Fade in={true}>
                <Box
                  bg={primaryColor}
                  h="200px"
                  borderRadius="xl"
                  boxShadow="xl"
                  position="relative"
                  transition="all 0.3s"
                  border="4px solid"
                  borderColor={borderColor}
                >
                  <Box
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                    bg="blackAlpha.700"
                    backdropFilter="blur(10px)"
                    borderRadius="lg"
                    p={3}
                  >
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      fontFamily="mono"
                      color="white"
                      textAlign="center"
                      letterSpacing="wider"
                    >
                      {primaryColor}
                    </Text>
                  </Box>
                </Box>
              </Fade>

              {/* Color Picker Component */}
              <Fade in={true} transition={{ enter: { delay: 0.1 } }}>
                <ColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                />
              </Fade>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Fade in={true} transition={{ enter: { delay: 0.15 } }}>
                  <Button
                    leftIcon={<FaDownload />}
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    onClick={onExportOpen}
                    variant="solid"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Export Palette
                  </Button>
                </Fade>

                <Fade in={true} transition={{ enter: { delay: 0.2 } }}>
                  <Button
                    leftIcon={<FaUniversalAccess />}
                    colorScheme="purple"
                    size="lg"
                    width="full"
                    onClick={onAccessibilityOpen}
                    variant="outline"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      bg: useColorModeValue('purple.50', 'purple.900'),
                    }}
                    transition="all 0.2s"
                  >
                    Check Accessibility
                  </Button>
                </Fade>

                <Fade in={true} transition={{ enter: { delay: 0.25 } }}>
                  <Button
                    leftIcon={<FaEye />}
                    colorScheme="cyan"
                    size="lg"
                    width="full"
                    onClick={onPreviewOpen}
                    variant="outline"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      bg: useColorModeValue('cyan.50', 'cyan.900'),
                    }}
                    transition="all 0.2s"
                  >
                    Preview & Gradients
                  </Button>
                </Fade>
              </VStack>

              {/* Instructions */}
              <Fade in={true} transition={{ enter: { delay: 0.3 } }}>
                <VStack
                  align="start"
                  spacing={3}
                  p={4}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  flex={1}
                >
                  <Heading size="sm" color={headingColor}>
                    How to use
                  </Heading>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color={textColor}>
                      • Pick a color using the color picker
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      • Enter a hex code directly
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      • Click "Random Color" for inspiration
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      • Explore multiple variations per palette type
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      • Click any color to copy its value
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      • Expand sections to see shade variations
                    </Text>
                  </VStack>
                </VStack>
              </Fade>
            </VStack>
          </GridItem>

          {/* Right Content - Palette Display */}
          <GridItem
            p={{ base: 4, md: 6 }}
            overflowY="auto"
            maxH="calc(100vh - 80px)"
          >
            <Container maxW="container.xl" px={0}>
              <VStack spacing={6} align="stretch">
                {/* Section Header */}
                <ScaleFade initialScale={0.9} in={true}>
                  <VStack align="start" spacing={2} mb={2}>
                    <Heading size="lg" color={headingColor}>
                      Generated Palette Variations
                    </Heading>
                    <Text fontSize="sm" color={textColor}>
                      Explore multiple variations of each color harmony type for maximum creative flexibility
                    </Text>
                  </VStack>
                </ScaleFade>

                {/* Palette Sections - Full width for variations */}
                <Stack spacing={6}>
                  {paletteOrder.map((type, index) => (
                    <Fade
                      key={type}
                      in={true}
                      transition={{ enter: { delay: 0.1 + index * 0.05 } }}
                    >
                      <PaletteSectionVariations
                        palette={palettes[type]}
                        isExpanded={type === 'monochromatic' || type === 'analogous'}
                      />
                    </Fade>
                  ))}
                </Stack>
              </VStack>
            </Container>
          </GridItem>
        </Grid>
      </Box>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="4xl">
          <ModalHeader>Export Color Palette</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ExportPanel
              shades={shades}
              primaryColor={primaryColor}
              onClose={onExportClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Accessibility Modal */}
      <Modal isOpen={isAccessibilityOpen} onClose={onAccessibilityClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalHeader>Accessibility Analysis</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} overflowY="auto">
            <AccessibilityPanel shades={shades} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Preview & Gradients Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalHeader>Preview & Gradients</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} overflowY="auto">
            <ComponentGradientPanel shades={shades} primaryColor={primaryColor} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
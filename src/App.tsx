import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  useColorModeValue,
  Fade,
  ScaleFade,
} from '@chakra-ui/react';
import { Header } from '@/components/Header';
import { ColorPicker } from '@/components/ColorPicker';
import { SchemeDisplay } from '@/components/ColorSchemes/SchemeDisplay';
import { generateShades } from '@/utils/shadeGenerator';
import type { ColorShades } from '@/types';

/**
 * Main application component - Phase 1
 * Simple color shade generator with clean UI
 */
function App() {
  // Single state: the selected color
  const [primaryColor, setPrimaryColor] = useState<string>('#84CC16');

  // Theme values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Generate color shades whenever primary color changes
  const colorShades = useMemo<ColorShades>(() => {
    return generateShades(primaryColor);
  }, [primaryColor]);

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          {/* Instructions */}
          <ScaleFade initialScale={0.9} in={true}>
            <VStack spacing={3} textAlign="center">
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="medium"
                color={textColor}
              >
                Pick a color and get perfect shades instantly
              </Text>
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                color={textColor}
                opacity={0.8}
              >
                Generate a complete palette from 50 to 900 for your design system
              </Text>
            </VStack>
          </ScaleFade>

          {/* Color Picker */}
          <Fade in={true}>
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
            >
              <ColorPicker
                color={primaryColor}
                onChange={setPrimaryColor}
              />
            </Box>
          </Fade>

          {/* Generated Shades Display */}
          <Fade in={true} transition={{ enter: { delay: 0.2 } }}>
            <SchemeDisplay
              primaryColor={primaryColor}
              shades={colorShades}
            />
          </Fade>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
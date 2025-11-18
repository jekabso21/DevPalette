/**
 * ComponentGradientPanel - Main panel with tabbed interface
 * Combines Component Preview and Gradient Generator in a tabbed layout
 */

import { useState, memo } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FaDesktop, FaFillDrip } from 'react-icons/fa';
import { ComponentPreview } from './ComponentPreview';
import { GradientGenerator } from '../Gradients/GradientGenerator';
import { GradientPreview } from '../Gradients/GradientPreview';
import { GradientPresetGallery } from '../Gradients/GradientPresetGallery';
import type { ColorShades } from '@/types';
import type { GradientConfig, GradientPreset } from '@/utils/gradientGenerator';

interface ComponentGradientPanelProps {
  shades: ColorShades;
  primaryColor: string;
}

export const ComponentGradientPanel = memo(({
  shades,
  primaryColor,
}: ComponentGradientPanelProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const tabBg = useColorModeValue('gray.50', 'gray.900');

  // State for gradient generator
  const [currentGradient, setCurrentGradient] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    colors: [
      { color: shades[200], position: 0 },
      { color: shades[500], position: 50 },
      { color: shades[800], position: 100 },
    ],
  });

  // Handle preset selection
  const handlePresetSelect = (preset: GradientPreset) => {
    setCurrentGradient(preset.gradient);
  };

  return (
    <Box bg={bgColor} minH="80vh">
      <Tabs
        variant="enclosed"
        colorScheme="brand"
        isLazy
        lazyBehavior="unmount"
      >
        <TabList bg={tabBg} borderBottom="2px" borderColor={borderColor}>
          <Tab
            _selected={{
              color: 'brand.500',
              borderColor: 'brand.500',
              borderBottomColor: bgColor,
              bg: bgColor,
            }}
            fontWeight="medium"
          >
            <HStack spacing={2}>
              <Icon as={FaDesktop} />
              <Text>Component Preview</Text>
            </HStack>
          </Tab>
          <Tab
            _selected={{
              color: 'brand.500',
              borderColor: 'brand.500',
              borderBottomColor: bgColor,
              bg: bgColor,
            }}
            fontWeight="medium"
          >
            <HStack spacing={2}>
              <Icon as={FaFillDrip} />
              <Text>Gradient Generator</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Component Preview Tab */}
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch" p={6}>
              {/* Header */}
              <Box>
                <Heading size="lg" color={textColor} mb={2}>
                  Component Preview
                </Heading>
                <Text color={mutedTextColor}>
                  See how your color palette looks in real UI components. These examples demonstrate
                  various use cases including buttons, cards, forms, and more.
                </Text>
              </Box>

              <Divider />

              {/* Component Preview Content */}
              <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                borderRadius="xl"
                p={6}
                maxH="70vh"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: useColorModeValue('gray.100', 'gray.700'),
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: shades[400],
                    borderRadius: '10px',
                    '&:hover': {
                      background: shades[500],
                    },
                  },
                }}
              >
                <ComponentPreview shades={shades} primaryColor={primaryColor} />
              </Box>
            </VStack>
          </TabPanel>

          {/* Gradient Generator Tab */}
          <TabPanel p={0}>
            <Box p={6}>
              {/* Header */}
              <Box mb={6}>
                <Heading size="lg" color={textColor} mb={2}>
                  Gradient Generator
                </Heading>
                <Text color={mutedTextColor}>
                  Create beautiful gradients from your color palette. Experiment with different
                  types, angles, and color combinations.
                </Text>
              </Box>

              <Divider mb={6} />

              <Grid
                templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                gap={6}
              >
                {/* Left: Generator Controls */}
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    {/* Gradient Generator */}
                    <Box
                      bg={useColorModeValue('gray.50', 'gray.900')}
                      borderRadius="xl"
                      p={6}
                      borderWidth={1}
                      borderColor={borderColor}
                    >
                      <GradientGenerator
                        shades={shades}
                        primaryColor={primaryColor}
                        onGradientChange={setCurrentGradient}
                      />
                    </Box>
                  </VStack>
                </GridItem>

                {/* Right: Preview and Presets */}
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    {/* Gradient Preview */}
                    <Box
                      bg={useColorModeValue('gray.50', 'gray.900')}
                      borderRadius="xl"
                      p={6}
                      borderWidth={1}
                      borderColor={borderColor}
                    >
                      <GradientPreview
                        gradient={currentGradient}
                        name={primaryColor.replace('#', '')}
                      />
                    </Box>
                  </VStack>
                </GridItem>
              </Grid>

              {/* Preset Gallery */}
              <Box mt={8}>
                <Divider mb={6} />
                <Box
                  bg={useColorModeValue('gray.50', 'gray.900')}
                  borderRadius="xl"
                  p={6}
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <GradientPresetGallery
                    shades={shades}
                    primaryColor={primaryColor}
                    onSelectPreset={handlePresetSelect}
                  />
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

ComponentGradientPanel.displayName = 'ComponentGradientPanel';
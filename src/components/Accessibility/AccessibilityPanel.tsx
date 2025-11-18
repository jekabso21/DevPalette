/**
 * Accessibility Panel Component
 * Main component with tabbed interface for accessibility features
 */

import { memo, useMemo } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaUniversalAccess, FaEye, FaCheckCircle } from 'react-icons/fa';
import { ContrastMatrix } from './ContrastMatrix';
import { ColorBlindnessSimulator } from './ColorBlindnessSimulator';
import { getAccessibilityWarnings } from '@/utils/accessibilityHelpers';
import type { ColorShades } from '@/types';

interface AccessibilityPanelProps {
  shades: ColorShades;
}

/**
 * Main Accessibility Panel with tabbed interface
 */
export const AccessibilityPanel = memo(({ shades }: AccessibilityPanelProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const tabBg = useColorModeValue('gray.50', 'gray.800');
  const selectedTabBg = useColorModeValue('brand.500', 'brand.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Get accessibility warnings
  const warnings = useMemo(() => {
    return getAccessibilityWarnings(shades);
  }, [shades]);

  // Categorize warnings
  const errorWarnings = warnings.filter(w => w.severity === 'error');
  const warningWarnings = warnings.filter(w => w.severity === 'warning');
  const infoWarnings = warnings.filter(w => w.severity === 'info');

  return (
    <Box bg={bgColor}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box px={6} pt={6}>
          <HStack spacing={3} mb={2}>
            <Icon as={FaUniversalAccess} boxSize={6} color="brand.500" />
            <Heading size="lg" color={textColor}>
              Accessibility Analysis
            </Heading>
          </HStack>
          <Text color={mutedColor} fontSize="sm">
            Comprehensive tools to ensure your color palette meets accessibility standards
          </Text>
        </Box>

        {/* Warnings Summary */}
        {warnings.length > 0 && (
          <Box px={6}>
            {errorWarnings.length > 0 && (
              <Alert status="error" mb={3} borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Critical Issues Found</AlertTitle>
                  <VStack align="start" spacing={1} mt={2}>
                    {errorWarnings.map((warning, index) => (
                      <Text key={index} fontSize="sm">
                        • {warning.message}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              </Alert>
            )}

            {warningWarnings.length > 0 && (
              <Alert status="warning" mb={3} borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Warnings</AlertTitle>
                  <VStack align="start" spacing={1} mt={2}>
                    {warningWarnings.map((warning, index) => (
                      <Text key={index} fontSize="sm">
                        • {warning.message}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              </Alert>
            )}

            {infoWarnings.length > 0 && (
              <Alert status="info" mb={3} borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Suggestions</AlertTitle>
                  <VStack align="start" spacing={1} mt={2}>
                    {infoWarnings.map((warning, index) => (
                      <Text key={index} fontSize="sm">
                        • {warning.message}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              </Alert>
            )}
          </Box>
        )}

        {/* No warnings message */}
        {warnings.length === 0 && (
          <Box px={6}>
            <Alert status="success" borderRadius="lg">
              <AlertIcon as={FaCheckCircle} />
              <Box>
                <AlertTitle>Excellent Accessibility!</AlertTitle>
                <AlertDescription fontSize="sm">
                  Your color palette meets recommended accessibility standards with good contrast ratios and color differentiation.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )}

        {/* Tabbed Interface */}
        <Tabs
          variant="enclosed"
          colorScheme="brand"
          size="lg"
          isLazy
          lazyBehavior="unmount"
        >
          <TabList px={6}>
            <Tab
              _selected={{
                bg: selectedTabBg,
                color: 'white',
                borderColor: selectedTabBg,
                borderBottomColor: bgColor,
              }}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
              }}
            >
              <HStack spacing={2}>
                <Icon as={FaCheckCircle} />
                <Text>Contrast Matrix</Text>
              </HStack>
            </Tab>
            <Tab
              _selected={{
                bg: selectedTabBg,
                color: 'white',
                borderColor: selectedTabBg,
                borderBottomColor: bgColor,
              }}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
              }}
            >
              <HStack spacing={2}>
                <Icon as={FaEye} />
                <Text>Color Blindness</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Contrast Matrix Tab */}
            <TabPanel p={0}>
              <Box bg={tabBg} minH="500px">
                <ContrastMatrix shades={shades} />
              </Box>
            </TabPanel>

            {/* Color Blindness Simulator Tab */}
            <TabPanel p={0}>
              <Box bg={tabBg} minH="500px">
                <ColorBlindnessSimulator shades={shades} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
});

AccessibilityPanel.displayName = 'AccessibilityPanel';
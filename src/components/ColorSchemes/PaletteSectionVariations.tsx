import { memo } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Collapse,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { PaletteWithVariations } from '@/types';
import { PaletteVariationCard } from './PaletteVariationCard';

interface PaletteSectionVariationsProps {
  palette: PaletteWithVariations;
  isExpanded?: boolean;
}

/**
 * Component to display a palette section with multiple variations
 * Shows variations in a responsive grid layout
 */
export const PaletteSectionVariations = memo(function PaletteSectionVariations({
  palette,
  isExpanded = true,
}: PaletteSectionVariationsProps) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isExpanded });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  // Determine grid columns based on number of variations
  const getGridColumns = () => {
    const count = palette.variations.length;
    if (count === 1) return { base: 1, md: 1 };
    if (count === 2) return { base: 1, md: 2 };
    if (count === 3) return { base: 1, md: 3, lg: 3 };
    return { base: 1, md: 2, lg: 2, xl: 2 };
  };

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      variant="outline"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'lg',
      }}
    >
      <CardBody p={0}>
        {/* Header Section */}
        <Box px={6} py={4} bg={sectionBg}>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <Heading size="md" color={headingColor}>
                {palette.name}
              </Heading>
              <Text fontSize="sm" color={descriptionColor}>
                {palette.description}
              </Text>
              {palette.variations.length > 1 && (
                <Text fontSize="xs" color={descriptionColor} fontWeight="medium">
                  {palette.variations.length} variations available
                </Text>
              )}
            </VStack>
            <IconButton
              aria-label={isOpen ? 'Collapse' : 'Expand'}
              icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
              onClick={onToggle}
              size="sm"
              variant="ghost"
              color={descriptionColor}
            />
          </HStack>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Variations Grid */}
        <Collapse in={isOpen} animateOpacity>
          <Box p={4}>
            <SimpleGrid columns={getGridColumns()} spacing={4}>
              {palette.variations.map((variation, index) => (
                <PaletteVariationCard
                  key={`${palette.type}-variation-${index}`}
                  variation={variation}
                  showShadesInitially={palette.type === 'monochromatic'}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Collapse>
      </CardBody>
    </Card>
  );
});

PaletteSectionVariations.displayName = 'PaletteSectionVariations';
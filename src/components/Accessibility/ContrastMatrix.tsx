/**
 * Contrast Matrix Component
 * Displays WCAG contrast ratios between all shade combinations
 */

import { memo, useMemo } from 'react';
import {
  Box,
  Grid,
  Text,
  Tooltip,
  Badge,
  VStack,
  HStack,
  Heading,
  useColorModeValue,
  Flex,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { calculateContrastMatrix, type ContrastMatrixData, type WCAGLevel } from '@/utils/accessibilityHelpers';
import type { ColorShades } from '@/types';

interface ContrastMatrixProps {
  shades: ColorShades;
}

interface ContrastCellProps {
  ratio: number;
  level: WCAGLevel;
  color1: string;
  color2: string;
  shade1: string;
  shade2: string;
}

/**
 * Individual cell in the contrast matrix
 */
const ContrastCell = memo(({ ratio, level, color1, color2, shade1, shade2 }: ContrastCellProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const identicalBg = useColorModeValue('gray.100', 'gray.700');
  const aaaBg = useColorModeValue('green.50', 'green.900');
  const aaBg = useColorModeValue('yellow.50', 'yellow.900');
  const failBg = useColorModeValue('red.50', 'red.900');

  // Determine cell background color based on WCAG level
  const getCellBg = () => {
    if (shade1 === shade2) return identicalBg;
    switch (level) {
      case 'AAA':
        return aaaBg;
      case 'AA':
        return aaBg;
      case 'Fail':
        return failBg;
      default:
        return bgColor;
    }
  };

  // Get icon based on level
  const getLevelIcon = () => {
    switch (level) {
      case 'AAA':
        return FaCheckCircle;
      case 'AA':
        return FaExclamationTriangle;
      case 'Fail':
        return FaTimesCircle;
      default:
        return null;
    }
  };

  const LevelIcon = getLevelIcon();
  const isIdentical = shade1 === shade2;

  return (
    <Tooltip
      label={
        isIdentical ? (
          `Same shade (${shade1})`
        ) : (
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Contrast Ratio: {ratio.toFixed(2)}:1</Text>
            <Text>Level: {level === 'Fail' ? 'Does not meet WCAG' : `WCAG ${level}`}</Text>
            <HStack spacing={2}>
              <Box w={4} h={4} bg={color1} borderRadius="sm" border="1px solid" borderColor="whiteAlpha.400" />
              <Text fontSize="xs">{shade1}</Text>
              <Text fontSize="xs">↔</Text>
              <Box w={4} h={4} bg={color2} borderRadius="sm" border="1px solid" borderColor="whiteAlpha.400" />
              <Text fontSize="xs">{shade2}</Text>
            </HStack>
          </VStack>
        )
      }
      placement="top"
      hasArrow
      isDisabled={isIdentical}
    >
      <Box
        w="100%"
        h="100%"
        minH="40px"
        bg={getCellBg()}
        border="1px solid"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor={isIdentical ? 'default' : 'pointer'}
        transition="all 0.2s"
        _hover={
          isIdentical
            ? {}
            : {
                transform: 'scale(1.05)',
                boxShadow: 'md',
                zIndex: 1,
              }
        }
        position="relative"
      >
        {isIdentical ? (
          <Text fontSize="xs" color="gray.500">—</Text>
        ) : (
          <VStack spacing={0}>
            {LevelIcon && (
              <Icon
                as={LevelIcon}
                boxSize={3}
                color={
                  level === 'AAA'
                    ? 'green.500'
                    : level === 'AA'
                    ? 'yellow.600'
                    : 'red.500'
                }
              />
            )}
            <Text fontSize="xs" fontWeight="semibold">
              {ratio.toFixed(1)}
            </Text>
          </VStack>
        )}
      </Box>
    </Tooltip>
  );
});

ContrastCell.displayName = 'ContrastCell';

/**
 * Legend component showing WCAG level explanations
 */
const ContrastLegend = memo(() => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
    >
      <Heading size="sm" mb={3}>WCAG Contrast Levels</Heading>
      <VStack align="stretch" spacing={2}>
        <HStack>
          <Icon as={FaCheckCircle} color="green.500" />
          <Badge colorScheme="green">AAA</Badge>
          <Text fontSize="sm">≥ 7:1 (normal text) or ≥ 4.5:1 (large text)</Text>
        </HStack>
        <HStack>
          <Icon as={FaExclamationTriangle} color="yellow.600" />
          <Badge colorScheme="yellow">AA</Badge>
          <Text fontSize="sm">≥ 4.5:1 (normal text) or ≥ 3:1 (large text)</Text>
        </HStack>
        <HStack>
          <Icon as={FaTimesCircle} color="red.500" />
          <Badge colorScheme="red">Fail</Badge>
          <Text fontSize="sm">Does not meet WCAG minimum standards</Text>
        </HStack>
      </VStack>
      <Alert status="info" mt={3} borderRadius="md" fontSize="sm">
        <AlertIcon />
        <AlertDescription>
          Large text is 18pt (24px) or 14pt (18.5px) bold and above.
        </AlertDescription>
      </Alert>
    </Box>
  );
});

ContrastLegend.displayName = 'ContrastLegend';

/**
 * Main Contrast Matrix component
 */
export const ContrastMatrix = memo(({ shades }: ContrastMatrixProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const headerBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerBorderColor = useColorModeValue('gray.300', 'gray.600');
  const statGreenBg = useColorModeValue('green.50', 'green.900');
  const statYellowBg = useColorModeValue('yellow.50', 'yellow.900');
  const statRedBg = useColorModeValue('red.50', 'red.900');

  // Calculate contrast matrix data
  const matrixData = useMemo<ContrastMatrixData>(() => {
    return calculateContrastMatrix(shades);
  }, [shades]);

  // Calculate statistics
  const stats = useMemo(() => {
    let aaaCount = 0;
    let aaCount = 0;
    let failCount = 0;
    let totalCombinations = 0;

    for (let i = 0; i < matrixData.matrix.length; i++) {
      for (let j = 0; j < matrixData.matrix[i].length; j++) {
        if (i !== j) {
          totalCombinations++;
          const level = matrixData.matrix[i][j].level;
          if (level === 'AAA') aaaCount++;
          else if (level === 'AA') aaCount++;
          else failCount++;
        }
      }
    }

    return {
      total: totalCombinations,
      aaa: aaaCount,
      aa: aaCount,
      fail: failCount,
      aaaPercentage: ((aaaCount / totalCombinations) * 100).toFixed(1),
      aaPercentage: ((aaCount / totalCombinations) * 100).toFixed(1),
      failPercentage: ((failCount / totalCombinations) * 100).toFixed(1),
    };
  }, [matrixData]);

  return (
    <Box bg={bgColor} p={4}>
      <VStack spacing={6} align="stretch">
        {/* Statistics Summary */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <Box p={4} bg={statGreenBg} borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color="green.600">
                  WCAG AAA
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {stats.aaa}
                </Text>
              </VStack>
              <Text fontSize="lg" fontWeight="semibold" color="green.600">
                {stats.aaaPercentage}%
              </Text>
            </HStack>
          </Box>

          <Box p={4} bg={statYellowBg} borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color="yellow.600">
                  WCAG AA
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {stats.aa}
                </Text>
              </VStack>
              <Text fontSize="lg" fontWeight="semibold" color="yellow.600">
                {stats.aaPercentage}%
              </Text>
            </HStack>
          </Box>

          <Box p={4} bg={statRedBg} borderRadius="lg">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color="red.600">
                  Below Standards
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {stats.fail}
                </Text>
              </VStack>
              <Text fontSize="lg" fontWeight="semibold" color="red.600">
                {stats.failPercentage}%
              </Text>
            </HStack>
          </Box>
        </Grid>

        {/* Matrix Grid */}
        <Box overflowX="auto" overflowY="auto" maxH="600px">
          <Box minW="fit-content">
            <Grid
              templateColumns={`60px repeat(${matrixData.shades.length}, 50px)`}
              templateRows={`40px repeat(${matrixData.shades.length}, 40px)`}
              gap={0}
            >
              {/* Top-left corner cell */}
              <Box bg={headerBg} />

              {/* Column headers */}
              {matrixData.shades.map((shade) => (
                <Flex
                  key={`col-${shade.shade}`}
                  bg={headerBg}
                  align="center"
                  justify="center"
                  borderRight="1px solid"
                  borderColor={headerBorderColor}
                >
                  <VStack spacing={0}>
                    <Box w={6} h={3} bg={shade.color} borderRadius="sm" />
                    <Text fontSize="xs" fontWeight="semibold">
                      {shade.shade}
                    </Text>
                  </VStack>
                </Flex>
              ))}

              {/* Rows */}
              {matrixData.shades.map((rowShade, rowIndex) => (
                <>
                  {/* Row header */}
                  <Flex
                    key={`row-${rowShade.shade}`}
                    bg={headerBg}
                    align="center"
                    justify="center"
                    borderBottom="1px solid"
                    borderColor={headerBorderColor}
                  >
                    <HStack spacing={1}>
                      <Box w={3} h={6} bg={rowShade.color} borderRadius="sm" />
                      <Text fontSize="xs" fontWeight="semibold">
                        {rowShade.shade}
                      </Text>
                    </HStack>
                  </Flex>

                  {/* Row cells */}
                  {matrixData.shades.map((colShade, colIndex) => (
                    <ContrastCell
                      key={`cell-${rowShade.shade}-${colShade.shade}`}
                      ratio={matrixData.matrix[rowIndex][colIndex].ratio}
                      level={matrixData.matrix[rowIndex][colIndex].level}
                      color1={rowShade.color}
                      color2={colShade.color}
                      shade1={rowShade.shade}
                      shade2={colShade.shade}
                    />
                  ))}
                </>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Legend */}
        <ContrastLegend />
      </VStack>
    </Box>
  );
});

ContrastMatrix.displayName = 'ContrastMatrix';
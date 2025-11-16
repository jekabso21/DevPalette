import { memo } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaPalette } from 'react-icons/fa';

/**
 * Simple, clean header component for Phase 1
 */
export const Header = memo(function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'white');
  const taglineColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      sx={{
        backgroundColor: useColorModeValue(
          'rgba(255, 255, 255, 0.95)',
          'rgba(26, 32, 44, 0.95)'
        ),
      }}
      boxShadow="sm"
    >
      <Container maxW="container.xl" py={{ base: 3, md: 4 }}>
        <Flex align="center" justify="space-between">
          {/* Logo and Title */}
          <HStack spacing={{ base: 2, md: 3 }}>
            <Box
              as={FaPalette}
              fontSize={{ base: '24px', md: '28px' }}
              color="brand.500"
              aria-hidden="true"
              transition="transform 0.2s"
              _hover={{ transform: 'rotate(15deg)' }}
            />
            <Box>
              <Heading
                as="h1"
                size={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                letterSpacing="tight"
                color={headingColor}
              >
                DevPalette
              </Heading>
              <Text
                fontSize={{ base: 'xs', sm: 'sm' }}
                color={taglineColor}
                display={{ base: 'none', sm: 'block' }}
              >
                Generate perfect color shades instantly
              </Text>
            </Box>
          </HStack>

          {/* Dark Mode Toggle */}
          <Tooltip
            label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            placement="bottom-end"
            hasArrow
          >
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color={taglineColor}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                color: 'brand.400',
                transform: 'scale(1.1)',
              }}
              size={{ base: 'sm', md: 'md' }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Flex>
      </Container>
    </Box>
  );
});

Header.displayName = 'Header';
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
  HStack,
  VStack,
  Link,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaGithub } from 'react-icons/fa';

/**
 * Compact header component with streamlined design
 */
export const Header = memo(function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'white');
  const taglineColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={3}
      backdropFilter="blur(10px)"
      sx={{
        backgroundColor: useColorModeValue(
          'rgba(255, 255, 255, 0.95)',
          'rgba(26, 32, 44, 0.95)'
        ),
      }}
    >
      <Container maxW="container.2xl" px={{ base: 4, md: 6 }}>
        <Flex align="center" justify="space-between" h="full">
          {/* Left: Compact Logo + Tagline */}
          <VStack align="start" spacing={0}>
            <Heading
              as="h1"
              size="md"
              fontWeight="bold"
              letterSpacing="tight"
              color={headingColor}
            >
              Dev
              <Text as="span" color="brand.500">
                Palette
              </Text>
            </Heading>
            <Text
              fontSize="xs"
              color={taglineColor}
              display={{ base: 'none', md: 'block' }}
              mt={-0.5}
            >
              Generate perfect color shades
            </Text>
          </VStack>

          {/* Right: Icon-only actions */}
          <HStack spacing={2}>
            {/* Dark Mode Toggle */}
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              color={useColorModeValue('gray.600', 'gray.400')}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                color: 'brand.500',
              }}
              transition="all 0.2s"
            />

            {/* GitHub Link */}
            <IconButton
              as={Link}
              href="https://github.com/yourusername/devpalette"
              isExternal
              aria-label="View on GitHub"
              icon={<FaGithub />}
              variant="ghost"
              size="sm"
              color={useColorModeValue('gray.600', 'gray.400')}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                color: useColorModeValue('gray.900', 'white'),
              }}
              transition="all 0.2s"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
});

Header.displayName = 'Header';
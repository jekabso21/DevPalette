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
  Link,
  Badge,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaPalette, FaGithub } from 'react-icons/fa';

/**
 * Enhanced header component with GitHub link and improved styling
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
      h={{ base: '70px', md: '80px' }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="100%" px={{ base: 4, md: 6 }}>
        <Flex align="center" justify="space-between">
          {/* Logo and Title */}
          <HStack spacing={{ base: 2, md: 3 }}>
            <Box
              as={FaPalette}
              fontSize={{ base: '28px', md: '32px' }}
              color="brand.500"
              aria-hidden="true"
              transition="transform 0.2s"
              _hover={{ transform: 'rotate(15deg)' }}
            />
            <Box>
              <HStack align="baseline" spacing={2}>
                <Heading
                  as="h1"
                  size={{ base: 'md', md: 'lg' }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  color={headingColor}
                >
                  DevPalette
                </Heading>
                <Badge
                  colorScheme="brand"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  display={{ base: 'none', md: 'inline-flex' }}
                >
                  v2.0
                </Badge>
              </HStack>
              <Text
                fontSize={{ base: 'xs', sm: 'sm' }}
                color={taglineColor}
                display={{ base: 'none', sm: 'block' }}
              >
                Professional color palette generator for developers
              </Text>
            </Box>
          </HStack>

          {/* Actions */}
          <HStack spacing={{ base: 1, md: 2 }}>
            {/* GitHub Link */}
            <Tooltip label="View on GitHub" placement="bottom" hasArrow>
              <IconButton
                as={Link}
                href="https://github.com/yourusername/devpalette"
                isExternal
                aria-label="View on GitHub"
                icon={<FaGithub />}
                variant="ghost"
                color={taglineColor}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                  color: headingColor,
                  transform: 'scale(1.1)',
                }}
                size={{ base: 'sm', md: 'md' }}
                transition="all 0.2s"
              />
            </Tooltip>

            {/* Dark Mode Toggle */}
            <Tooltip
              label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              placement="bottom"
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
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
});

Header.displayName = 'Header';
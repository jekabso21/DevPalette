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
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaPalette } from 'react-icons/fa';
import type { HeaderProps } from '@/types';

/**
 * Application header component with branding and color mode toggle
 */
export const Header = memo(function Header({
  title = 'DevPalette',
  showColorModeToggle = true,
}: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.400');

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
          'rgba(255, 255, 255, 0.8)',
          'rgba(26, 32, 44, 0.8)'
        ),
      }}
    >
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo and Title */}
          <Flex align="center" gap={3}>
            <Box
              as={FaPalette}
              fontSize="28px"
              color="brand.500"
              aria-hidden="true"
            />
            <Box>
              <Heading
                as="h1"
                size="lg"
                fontWeight="bold"
                letterSpacing="tight"
                color={useColorModeValue('gray.900', 'gray.100')}
              >
                {title}
              </Heading>
              <Text
                fontSize="sm"
                color={useColorModeValue('gray.600', 'gray.400')}
                display={{ base: 'none', sm: 'block' }}
              >
                Professional Color Palette Generator
              </Text>
            </Box>
          </Flex>

          {/* Actions */}
          <Flex align="center" gap={2}>
            {showColorModeToggle && (
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
                  color={iconColor}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.700'),
                    color: 'brand.400',
                  }}
                  size="md"
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
});

Header.displayName = 'Header';
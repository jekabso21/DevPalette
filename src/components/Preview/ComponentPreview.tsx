/**
 * ComponentPreview - Shows live UI components using the generated palette
 * Demonstrates how the color palette works in real-world UI components
 */

import { memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Heading,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Tag,
  TagLabel,
  TagLeftIcon,
  Avatar,
  AvatarGroup,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Stack,
  Checkbox,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaStar,
  FaUser,
  FaHome,
  FaCog,
  FaBell,
  FaRocket,
  FaPalette,
  FaCode,
} from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import type { ColorShades } from '@/types';

interface ComponentPreviewProps {
  shades: ColorShades;
  primaryColor: string;
}

export const ComponentPreview = memo(({ shades }: ComponentPreviewProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack spacing={8} align="stretch" p={6}>
      {/* Section: Buttons */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Buttons
        </Heading>
        <HStack spacing={4} flexWrap="wrap">
          <Button bg={shades[500]} color="white" _hover={{ bg: shades[600] }} size="lg">
            Primary Button
          </Button>
          <Button
            bg={shades[100]}
            color={shades[700]}
            _hover={{ bg: shades[200] }}
            size="lg"
          >
            Secondary
          </Button>
          <Button
            variant="outline"
            borderColor={shades[500]}
            color={shades[500]}
            _hover={{ bg: shades[50] }}
            size="lg"
          >
            Outline
          </Button>
          <Button variant="ghost" color={shades[600]} _hover={{ bg: shades[50] }} size="lg">
            Ghost
          </Button>
          <IconButton
            aria-label="Favorite"
            icon={<FaHeart />}
            bg={shades[500]}
            color="white"
            _hover={{ bg: shades[600] }}
            size="lg"
            isRound
          />
        </HStack>

        {/* Button Sizes */}
        <HStack spacing={4} mt={4}>
          <Button bg={shades[500]} color="white" size="xs">
            XS
          </Button>
          <Button bg={shades[500]} color="white" size="sm">
            Small
          </Button>
          <Button bg={shades[500]} color="white" size="md">
            Medium
          </Button>
          <Button bg={shades[500]} color="white" size="lg">
            Large
          </Button>
        </HStack>
      </Box>

      <Divider />

      {/* Section: Cards */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Cards
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {/* Basic Card */}
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
            <CardHeader bg={shades[50]} borderBottomWidth={1} borderColor={borderColor}>
              <HStack justify="space-between">
                <Heading size="sm" color={shades[700]}>
                  Basic Card
                </Heading>
                <Icon as={FaPalette} color={shades[500]} />
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color={mutedTextColor}>
                This card demonstrates how your palette works with card components, including
                headers and content areas.
              </Text>
            </CardBody>
            <CardFooter borderTopWidth={1} borderColor={borderColor}>
              <Button size="sm" bg={shades[500]} color="white" _hover={{ bg: shades[600] }}>
                Action
              </Button>
            </CardFooter>
          </Card>

          {/* Colored Card */}
          <Card bg={shades[500]} color="white">
            <CardBody>
              <VStack align="start" spacing={3}>
                <Icon as={FaRocket} boxSize={8} />
                <Heading size="md">Premium Feature</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  This card uses your primary color as the background with proper contrast.
                </Text>
                <Button size="sm" bg="white" color={shades[600]} _hover={{ bg: 'gray.100' }}>
                  Learn More
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Stats Card */}
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color={mutedTextColor}>Revenue</StatLabel>
                <StatNumber color={shades[600]}>$45,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" color={shades[500]} />
                  <Text as="span" color={shades[600]}>
                    23.5%
                  </Text>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Section: Badges & Tags */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Badges & Tags
        </Heading>
        <HStack spacing={3} flexWrap="wrap" mb={4}>
          <Badge bg={shades[100]} color={shades[700]} px={3} py={1} fontSize="sm">
            Default
          </Badge>
          <Badge bg={shades[500]} color="white" px={3} py={1} fontSize="sm">
            Primary
          </Badge>
          <Badge bg={shades[700]} color="white" px={3} py={1} fontSize="sm">
            Dark
          </Badge>
          <Badge variant="outline" borderColor={shades[500]} color={shades[500]} px={3} py={1}>
            Outline
          </Badge>
          <Badge bg={shades[50]} color={shades[600]} px={3} py={1}>
            Subtle
          </Badge>
        </HStack>

        <HStack spacing={3} flexWrap="wrap">
          <Tag size="lg" bg={shades[100]} color={shades[700]}>
            <TagLeftIcon as={FaCode} />
            <TagLabel>Development</TagLabel>
          </Tag>
          <Tag size="lg" bg={shades[500]} color="white">
            <TagLeftIcon as={FaStar} />
            <TagLabel>Featured</TagLabel>
          </Tag>
          <Tag size="lg" variant="outline" borderColor={shades[400]} color={shades[600]}>
            <TagLeftIcon as={FaUser} />
            <TagLabel>Team</TagLabel>
          </Tag>
        </HStack>
      </Box>

      <Divider />

      {/* Section: Alerts */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Alerts
        </Heading>
        <VStack spacing={3} align="stretch">
          <Alert status="success" bg={shades[50]} borderLeftWidth={4} borderColor={shades[500]}>
            <AlertIcon color={shades[500]} />
            <Box>
              <AlertTitle color={shades[700]}>Success!</AlertTitle>
              <AlertDescription color={mutedTextColor}>
                Your color palette has been generated successfully.
              </AlertDescription>
            </Box>
          </Alert>

          <Alert status="info" bg={shades[100]} borderLeftWidth={4} borderColor={shades[400]}>
            <AlertIcon color={shades[500]} />
            <AlertTitle color={shades[700]}>Info</AlertTitle>
            <AlertDescription color={mutedTextColor}>
              Click any color to copy its value to clipboard.
            </AlertDescription>
          </Alert>

          <Alert status="warning" bg={shades[50]} borderLeftWidth={4} borderColor={shades[600]}>
            <AlertIcon color={shades[600]} />
            <AlertTitle color={shades[700]}>Warning</AlertTitle>
            <AlertDescription color={mutedTextColor}>
              Some color combinations may have contrast issues.
            </AlertDescription>
          </Alert>
        </VStack>
      </Box>

      <Divider />

      {/* Section: Form Inputs */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Form Elements
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel color={shades[700]}>Email Address</FormLabel>
            <Input
              placeholder="Enter your email"
              borderColor={shades[300]}
              _hover={{ borderColor: shades[400] }}
              _focus={{
                borderColor: shades[500],
                boxShadow: `0 0 0 1px ${shades[500]}`,
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={shades[700]}>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password"
              borderColor={shades[300]}
              _hover={{ borderColor: shades[400] }}
              _focus={{
                borderColor: shades[500],
                boxShadow: `0 0 0 1px ${shades[500]}`,
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={shades[700]}>Preferences</FormLabel>
            <Stack spacing={2}>
              <Checkbox colorScheme="green" iconColor={shades[500]}>
                <Text color={mutedTextColor}>Enable notifications</Text>
              </Checkbox>
              <Checkbox colorScheme="green" iconColor={shades[500]}>
                <Text color={mutedTextColor}>Subscribe to newsletter</Text>
              </Checkbox>
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel color={shades[700]}>Theme</FormLabel>
            <RadioGroup defaultValue="1">
              <Stack spacing={2}>
                <Radio value="1" colorScheme="green">
                  <Text color={mutedTextColor}>Light</Text>
                </Radio>
                <Radio value="2" colorScheme="green">
                  <Text color={mutedTextColor}>Dark</Text>
                </Radio>
                <Radio value="3" colorScheme="green">
                  <Text color={mutedTextColor}>Auto</Text>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Section: Navigation */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Navigation
        </Heading>

        {/* Tab Navigation */}
        <Tabs variant="solid-rounded" colorScheme="green" mb={6}>
          <TabList bg={shades[50]} p={2} borderRadius="lg">
            <Tab
              _selected={{ bg: shades[500], color: 'white' }}
              color={shades[600]}
            >
              <Icon as={FaHome} mr={2} />
              Home
            </Tab>
            <Tab
              _selected={{ bg: shades[500], color: 'white' }}
              color={shades[600]}
            >
              <Icon as={FaUser} mr={2} />
              Profile
            </Tab>
            <Tab
              _selected={{ bg: shades[500], color: 'white' }}
              color={shades[600]}
            >
              <Icon as={FaCog} mr={2} />
              Settings
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text color={mutedTextColor}>Home content goes here...</Text>
            </TabPanel>
            <TabPanel>
              <Text color={mutedTextColor}>Profile content goes here...</Text>
            </TabPanel>
            <TabPanel>
              <Text color={mutedTextColor}>Settings content goes here...</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Menu */}
        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<HiDotsVertical />}
              bg={shades[100]}
              color={shades[700]}
              _hover={{ bg: shades[200] }}
            >
              Options
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaUser />} color={shades[600]}>
                Profile
              </MenuItem>
              <MenuItem icon={<FaBell />} color={shades[600]}>
                Notifications
              </MenuItem>
              <MenuItem icon={<FaCog />} color={shades[600]}>
                Settings
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      <Divider />

      {/* Section: Progress Indicators */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Progress Indicators
        </Heading>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontSize="sm" color={mutedTextColor} mb={2}>
              Linear Progress (60%)
            </Text>
            <Progress
              value={60}
              size="lg"
              bg={shades[100]}
              sx={{
                '& > div': {
                  background: `linear-gradient(90deg, ${shades[400]} 0%, ${shades[600]} 100%)`
                }
              }}
            />
          </Box>

          <Box>
            <Text fontSize="sm" color={mutedTextColor} mb={2}>
              Striped Progress (80%)
            </Text>
            <Progress
              value={80}
              size="lg"
              hasStripe
              isAnimated
              bg={shades[100]}
              sx={{
                '& > div': {
                  backgroundColor: shades[500]
                }
              }}
            />
          </Box>

          <HStack spacing={4}>
            <Box textAlign="center">
              <Box
                position="relative"
                display="inline-block"
                borderRadius="full"
                borderWidth={8}
                borderColor={shades[100]}
                borderStyle="solid"
              >
                <Box
                  position="absolute"
                  top="-8px"
                  left="-8px"
                  right="-8px"
                  bottom="-8px"
                  borderRadius="full"
                  borderWidth={8}
                  borderColor={shades[500]}
                  borderStyle="solid"
                  borderTopColor="transparent"
                  borderRightColor="transparent"
                  transform="rotate(-45deg)"
                />
                <Flex
                  align="center"
                  justify="center"
                  w={20}
                  h={20}
                  borderRadius="full"
                >
                  <Text fontWeight="bold" color={shades[700]}>
                    75%
                  </Text>
                </Flex>
              </Box>
              <Text fontSize="sm" color={mutedTextColor} mt={2}>
                Completion
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      {/* Section: Text Samples */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Typography
        </Heading>
        <VStack spacing={4} align="start">
          <Heading size="2xl" color={shades[800]}>
            Display Heading
          </Heading>
          <Heading size="xl" color={shades[700]}>
            Section Title
          </Heading>
          <Heading size="lg" color={shades[600]}>
            Subsection Header
          </Heading>
          <Text fontSize="lg" color={shades[700]}>
            This is body text using shade 700 for good readability.
          </Text>
          <Text color={mutedTextColor}>
            Secondary text uses a muted color for less emphasis while maintaining readability.
          </Text>
          <Text fontSize="sm" color={shades[500]}>
            Small text can use the primary color for links and accents.
          </Text>
        </VStack>
      </Box>

      {/* Avatars */}
      <Box>
        <Heading size="md" mb={4} color={textColor}>
          Avatars
        </Heading>
        <HStack spacing={4}>
          <AvatarGroup size="md" max={3}>
            <Avatar name="User One" bg={shades[500]} />
            <Avatar name="User Two" bg={shades[600]} />
            <Avatar name="User Three" bg={shades[700]} />
            <Avatar name="User Four" bg={shades[400]} />
            <Avatar name="User Five" bg={shades[300]} />
          </AvatarGroup>
        </HStack>
      </Box>
    </VStack>
  );
});

ComponentPreview.displayName = 'ComponentPreview';
import { ReactNode, memo } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaInfo, FaExclamationTriangle } from 'react-icons/fa';
import type { ToastType } from '@/types';

/**
 * Custom toast component for notifications
 * Provides consistent styling for success, error, warning, and info messages
 */

interface CustomToastProps {
  type: ToastType;
  title: string;
  description?: string;
  onClose?: () => void;
  action?: ReactNode;
}

// Animation will be handled by Chakra's built-in toast system
// Remove custom keyframes as they're not needed

export const CustomToast = memo(function CustomToast({
  type,
  title,
  description,
  onClose,
  action,
}: CustomToastProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.800', 'gray.100');
  const descColor = useColorModeValue('gray.600', 'gray.400');
  const closeHoverBg = useColorModeValue('gray.100', 'gray.700');
  const closeColor = useColorModeValue('gray.500', 'gray.400');

  // Pre-compute all color mode values
  const successBgAccent = useColorModeValue('green.50', 'green.900');
  const errorBgAccent = useColorModeValue('red.50', 'red.900');
  const warningBgAccent = useColorModeValue('yellow.50', 'yellow.900');
  const infoBgAccent = useColorModeValue('blue.50', 'blue.900');

  // Type-specific configurations
  const typeConfig = {
    success: {
      icon: FaCheck,
      color: 'green.500',
      bgAccent: successBgAccent,
      borderAccent: 'green.500',
    },
    error: {
      icon: FaTimes,
      color: 'red.500',
      bgAccent: errorBgAccent,
      borderAccent: 'red.500',
    },
    warning: {
      icon: FaExclamationTriangle,
      color: 'yellow.500',
      bgAccent: warningBgAccent,
      borderAccent: 'yellow.500',
    },
    info: {
      icon: FaInfo,
      color: 'blue.500',
      bgAccent: infoBgAccent,
      borderAccent: 'blue.500',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      borderLeft="4px solid"
      borderLeftColor={config.borderAccent}
      p={4}
      minW="300px"
      maxW="500px"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease-out"
      _hover={{
        boxShadow: '2xl',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Background accent */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="2px"
        bg={config.borderAccent}
      />

      <HStack spacing={3} align="start">
        {/* Icon */}
        <Box
          bg={config.bgAccent}
          borderRadius="md"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={16} color={config.color} />
        </Box>

        {/* Content */}
        <VStack align="start" flex={1} spacing={1}>
          <Text fontWeight="semibold" fontSize="sm" color={titleColor}>
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color={descColor}>
              {description}
            </Text>
          )}
          {action && <Box mt={2}>{action}</Box>}
        </VStack>

        {/* Close button */}
        {onClose && (
          <IconButton
            size="sm"
            variant="ghost"
            icon={<FaTimes />}
            aria-label="Close notification"
            onClick={onClose}
            color={closeColor}
            _hover={{
              bg: closeHoverBg,
            }}
          />
        )}
      </HStack>
    </Box>
  );
});

CustomToast.displayName = 'CustomToast';

/**
 * Toast container component for positioning toasts
 */
interface ToastContainerProps {
  children: ReactNode;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer = memo(function ToastContainer({
  children,
  position = 'bottom-right',
}: ToastContainerProps) {
  const positionStyles = {
    'top': { top: 4, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: 4, right: 4 },
    'top-left': { top: 4, left: 4 },
    'bottom': { bottom: 4, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: 4, right: 4 },
    'bottom-left': { bottom: 4, left: 4 },
  };

  return (
    <Box
      position="fixed"
      zIndex={9999}
      {...positionStyles[position]}
      pointerEvents="none"
    >
      <VStack spacing={2} align={position.includes('left') ? 'flex-start' : 'flex-end'}>
        <chakra.div pointerEvents="auto">{children}</chakra.div>
      </VStack>
    </Box>
  );
});

ToastContainer.displayName = 'ToastContainer';

/**
 * Hook for creating toast notifications
 * This is a simplified version - in production, use Chakra UI's useToast
 */
// eslint-disable-next-line react-refresh/only-export-components
export function createToast(props: CustomToastProps) {
  return <CustomToast {...props} />;
}
/**
 * CodePreview component for displaying formatted code with syntax highlighting
 */

import { memo, useCallback } from 'react';
import {
  Box,
  Button,
  Code,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

interface CodePreviewProps {
  code: string;
  language: string;
  maxHeight?: string;
}

export const CodePreview = memo(({ code, language, maxHeight = '400px' }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeColor = useColorModeValue('gray.800', 'gray.100');
  const headerBg = useColorModeValue('white', 'gray.800');

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      toast({
        title: 'Copied to clipboard',
        description: 'Code has been copied successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy code to clipboard',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }, [code, toast]);

  return (
    <Box
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
    >
      {/* Header with copy button */}
      <Flex
        px={4}
        py={2}
        bg={headerBg}
        borderBottomWidth={1}
        borderBottomColor={borderColor}
        align="center"
        justify="space-between"
      >
        <Text fontSize="sm" fontWeight="medium" color={codeColor}>
          {language.toUpperCase()}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={copied ? <FaCheck /> : <FaCopy />}
          colorScheme={copied ? 'green' : 'gray'}
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Flex>

      {/* Code content */}
      <Box
        p={4}
        maxH={maxHeight}
        overflowY="auto"
        overflowX="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bg: useColorModeValue('gray.100', 'gray.800'),
          },
          '&::-webkit-scrollbar-thumb': {
            bg: useColorModeValue('gray.400', 'gray.600'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            bg: useColorModeValue('gray.500', 'gray.500'),
          },
        }}
      >
        <Code
          as="pre"
          p={0}
          bg="transparent"
          color={codeColor}
          fontSize="sm"
          whiteSpace="pre"
          fontFamily="'Fira Code', 'Cascadia Code', Consolas, monospace"
          sx={{
            counterReset: 'line',
            '& > span': {
              counterIncrement: 'line',
            },
          }}
        >
          {code}
        </Code>
      </Box>
    </Box>
  );
});

CodePreview.displayName = 'CodePreview';
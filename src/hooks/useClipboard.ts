import { useState, useCallback, useEffect } from 'react';
import type { UseClipboardReturn } from '@/types';

/**
 * Custom hook for clipboard operations with TypeScript
 * Provides copy functionality with success/error states
 *
 * @param timeout - Duration in ms to show copied state (default 2000)
 * @returns Clipboard operations and state
 */
export function useClipboard(timeout: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  /**
   * Copy text to clipboard
   *
   * @param text - Text to copy
   */
  const copy = useCallback(
    async (text: string): Promise<void> => {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Reset error state
      setError(null);

      try {
        // Check if clipboard API is available
        if (!navigator?.clipboard) {
          throw new Error('Clipboard API not available');
        }

        // Attempt to copy to clipboard
        await navigator.clipboard.writeText(text);

        // Set copied state
        setCopied(true);

        // Reset copied state after timeout
        const id = setTimeout(() => {
          setCopied(false);
          setTimeoutId(null);
        }, timeout);

        setTimeoutId(id);
      } catch (err) {
        // Fallback method for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '-9999px';
          textArea.setAttribute('aria-hidden', 'true');

          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            setCopied(true);

            const id = setTimeout(() => {
              setCopied(false);
              setTimeoutId(null);
            }, timeout);

            setTimeoutId(id);
          } else {
            throw new Error('Failed to copy using fallback method');
          }
        } catch (fallbackErr) {
          const error = fallbackErr instanceof Error
            ? fallbackErr
            : new Error('Failed to copy to clipboard');

          setError(error);
          setCopied(false);

          // Throw the error to be handled by the caller
          throw error;
        }
      }
    },
    [timeout, timeoutId]
  );

  /**
   * Reset clipboard state
   */
  const reset = useCallback(() => {
    setCopied(false);
    setError(null);

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  return {
    copy,
    copied,
    error,
    reset,
  };
}

/**
 * Enhanced clipboard hook with additional features
 */
export function useEnhancedClipboard(options?: {
  timeout?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
}): UseClipboardReturn & { canCopy: boolean } {
  const { timeout = 2000, onSuccess, onError } = options || {};
  const baseClipboard = useClipboard(timeout);

  // Check if clipboard is supported
  const canCopy = typeof navigator !== 'undefined' &&
    (Boolean(navigator.clipboard) || Boolean(document.execCommand));

  // Wrap copy function with callbacks
  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        await baseClipboard.copy(text);
        onSuccess?.(text);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        onError?.(err);
        throw err;
      }
    },
    [baseClipboard, onSuccess, onError]
  );

  return {
    ...baseClipboard,
    copy,
    canCopy,
  };
}

/**
 * Hook for copying color values with format tracking
 */
export function useColorClipboard(options?: {
  timeout?: number;
  format?: 'hex' | 'rgb' | 'hsl';
}): {
  copyColor: (color: string, label?: string) => Promise<void>;
  copiedColor: string | null;
  copied: boolean;
  error: Error | null;
  reset: () => void;
} {
  const { timeout = 2000, format = 'hex' } = options || {};
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const clipboard = useClipboard(timeout);

  const copyColor = useCallback(
    async (color: string, label?: string): Promise<void> => {
      try {
        // Copy the color value
        await clipboard.copy(color);

        // Store the copied color with optional label
        setCopiedColor(label || color);

        // Reset after timeout
        setTimeout(() => {
          setCopiedColor(null);
        }, timeout);
      } catch (error) {
        // Error is handled by the base clipboard hook
        setCopiedColor(null);
        throw error;
      }
    },
    [clipboard, timeout]
  );

  const reset = useCallback(() => {
    clipboard.reset();
    setCopiedColor(null);
  }, [clipboard]);

  return {
    copyColor,
    copiedColor,
    copied: clipboard.copied,
    error: clipboard.error,
    reset,
  };
}
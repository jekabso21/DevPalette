import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme';

// Ensure the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root and render app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Color mode script for SSR and initial load */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />

    {/* Chakra Provider with custom theme */}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
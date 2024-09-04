// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { ClerkProvider } from '@clerk/clerk-react';
import { ChakraProvider } from '@chakra-ui/react';

const PUBLISHABLE_KEY = 'pk_test_ZmVhc2libGUtd29ybS0yNC5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Create a root for rendering the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ClerkProvider>
  </React.StrictMode>
);

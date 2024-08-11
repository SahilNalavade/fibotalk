import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ClerkProvider } from '@clerk/clerk-react';
import { ChakraProvider } from '@chakra-ui/react';

const PUBLISHABLE_KEY = 'pk_test_ZmVhc2libGUtd29ybS0yNC5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

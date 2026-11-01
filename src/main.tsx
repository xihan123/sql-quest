import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './app/global.css';
import { App } from './app/App.tsx';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

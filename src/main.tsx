import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';

// 🚀 UNIFIED PWA PRODUCTION TRACK: Standardizes paths and unblocks Google AI Studio wrappers
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => console.log('Service Worker registered at absolute scope:', reg.scope))
      .catch((err) => console.error('Service Worker connection blocked:', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

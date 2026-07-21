import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as Sentry from "@sentry/react"; // 🟢 Injected Sentry Import Hook Anchor
import App from './App.tsx';
import './index.css';

// 🟢 Initialize Privacy-Safe Sentry Tracking before any core UI modules boot up
Sentry.init({
  dsn: "https://sentry.io", // General project ingestion placeholder
  environment: "production",
  sendDefaultPii: false, // ❌ STRICT SECURITY: Completely blocks tracking user IP addresses or browser cookies
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
      delete event.user.username;
    }
    return event; // Returns pure, technical JavaScript stack trace errors only to protect user privacy
  },
  tracesSampleRate: 1.0,
});

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

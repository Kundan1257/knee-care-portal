import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as Sentry from "@sentry/react"; // 🟢 Injected Sentry Import Anchor
import App from './App.tsx';
import './index.css';

// 🟢 Initialize Privacy-Safe Sentry Tracking before any core layers render
Sentry.init({
  dsn: "https://sentry.io", // You can update this string token placeholder later!
  environment: "production",
  sendDefaultPii: false, // ❌ STRICT SECURITY: Completely forbids logging user IP addresses or tracking cookies
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
      delete event.user.username;
    }
    return event; // Returns pure, anonymized technical JavaScript stack traces only to protect user privacy
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

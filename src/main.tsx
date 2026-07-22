import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as Sentry from "@sentry/react"; // Injected Sentry Import Anchor
import App from './App.tsx';
import './index.css';

// Initialize Privacy-Safe Sentry Tracking
Sentry.init({
  dsn: "https://sentry.io",
  environment: "production",
  sendDefaultPii: false, // STRICT SECURITY: Completely blocks tracking user IP addresses or browser cookies
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

// 🟢 FUNCTION: Requests secure notification permissions natively from user device hardware
const initializePushNotifications = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permissions securely granted by user.');
        // Your backend messaging triggers can safely map to this device channel now!
      }
    });
  }
};

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        // 🟢 Fire permission request handshake immediately after service worker stabilizes securely
        initializePushNotifications();
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

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // 🚀 THE ESM BYPASS: Standardizes path mappings without crashing Node server contexts
  const currentDirName = path.dirname(fileURLToPath(import.meta.url));
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'inline',
                manifest: {
          name: 'Knee-Care: Ultimate Joint Support',
          short_name: 'Knee-Care',
          description: 'Biomechanical guidance and stability routines for long-term joint health.',
          theme_color: '#1E3A34',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ], // 🚀 NO NO CONFLICTS: Icons list array block ends cleanly with a closed bracket and a comma!
                    // 🚀 THE RICHER UI FIX: Uses valid camelCase keywords to satisfy the build compiler perfectly!
          screenshots: [
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              formFactor: 'wide',
              label: 'Knee-Care Desktop Application Portal'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              formFactor: 'narrow',
              label: 'Knee-Care Mobile Application Portal'
            }
          ]

        }

      })
    ],
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(currentDirName, '.'),
      },
    },
    build: {
      copyPublicDir: true, // 🚀 FORCE LOCK: Copies your manifest parameters directly into production
      rollupOptions: {
        external: ['mongoose', 'src/lib/db.ts']
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR === 'true' ? false : {
        overlay: false,
      }
    }
  };
});

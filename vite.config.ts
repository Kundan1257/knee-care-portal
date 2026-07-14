import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // 🚀 THE ESM BYPASS: Standardizes path mappings without crashing Node server contexts
  const currentDirName = path.dirname(fileURLToPath(import.meta.url));
  
  return {
    plugins: [
      react(), 
      tailwindcss() // 🟢 CLEAN PATHWAYS: Completely stripped out the virtual PWA override plugin layer!
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
      copyPublicDir: true, // 🚀 HARD LOCK: Forces Vite to copy your raw public manifest.json straight to production
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

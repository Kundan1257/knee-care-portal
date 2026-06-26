import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    // 🎯 THE SYSTEMIC MATCH: Ensures mobile browsers map your Vercel keys perfectly with zero crashes!
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
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

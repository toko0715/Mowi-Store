// toko0715/mowi-store/Mowi-Store-Oporto/AdminPanel/vite.config.js

// Nota: Hemos eliminado 'defineConfig' de vite y las referencias a TypeScript.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,

      },
    },
  },
});
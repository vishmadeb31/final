import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // This is crucial for Vercel. It allows process.env.API_KEY from Vercel's settings to be injected into the code.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
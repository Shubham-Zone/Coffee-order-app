import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: false,
    host: 'localhost',
    port: 5173, // Change if needed
  },
  build: {
    rollupOptions: {
      output: {
        format: "es", // Ensures module format
      },
    },
  },
});


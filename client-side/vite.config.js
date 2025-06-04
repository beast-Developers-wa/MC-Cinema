import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // listen on 0.0.0.0 for network access
    port: 5173,
    strictPort: true,
    https: false,     // disable HTTPS here
    // proxy if needed:
    // proxy: {
    //   '/api': 'http://localhost:5000',
    // },
  },
});

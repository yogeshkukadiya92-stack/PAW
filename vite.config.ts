import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: false,
        configure(proxy) {
          proxy.on('proxyReq', (outgoing, incoming) => {
            outgoing.setHeader('X-PAW-Dev-Peer', incoming.socket.remoteAddress || 'unknown');
          });
        },
      },
    },
    watch: { ignored: ['**/data/**'] },
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/data/**', '**/*.sqlite*', '**/server/**'] },
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
  },
});

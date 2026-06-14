import path from 'path';
import { defineConfig } from 'vite';
import { createVitePlugins } from './src/shared/build';

// https://vite.dev/config/
export default defineConfig({
  plugins: createVitePlugins(),
  base: '/vuejs-practice',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});

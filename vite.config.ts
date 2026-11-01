import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  // Keep bundled fonts on same-origin paths, including small CJK subsets.
  build: { assetsInlineLimit: 0 },
});

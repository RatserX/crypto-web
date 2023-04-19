import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/crypto-web/',
  plugins: [svelte({ hot: !process.env.VITEST })],
});

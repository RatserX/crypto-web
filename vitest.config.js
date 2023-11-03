import { defineConfig, mergeConfig } from 'vite';

import viteConfig from './vite.config';

// https://vitest.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  }),
);

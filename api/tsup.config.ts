import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/server.ts'],
    outDir: 'build/app',
    format: ['esm'],
    clean: true,
  },
  {
    entry: ['src/worker/search.ts'],
    outDir: 'build/app',
    format: ['cjs'],
  },
]);

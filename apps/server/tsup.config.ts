import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // @mono/shared 是工作区里的 TS 源码，直接打进产物，运行时不需要它
  noExternal: ['@mono/shared'],
});

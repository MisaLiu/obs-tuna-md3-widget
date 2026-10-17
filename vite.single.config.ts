import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import MainConfig from './vite.config.ts';

export default defineConfig({
  ...MainConfig,
  plugins: [
    ...MainConfig.plugins ?? [],
    viteSingleFile(),
  ]
});

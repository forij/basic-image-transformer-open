import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const prodBasePath = '/basic-image-transformer-open/';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ?  '/' : prodBasePath,
    plugins: [vue()],
  };
});

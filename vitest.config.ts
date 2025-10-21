import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@store': path.resolve(__dirname, 'src/store'),
      '@hooks': path.resolve(__dirname, 'src/libs/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@firebase': path.resolve(__dirname, 'src/firebase'),
    }
  }
});

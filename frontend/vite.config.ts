import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const require = createRequire(import.meta.url);

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Entry points for legacy React components not yet compiled in the main one
const legacyEntryPoints = [
  'app/sw.ts',
  'app/app.tsx',
  'group/MembershipsGroup.tsx',
  'group/MembershipsStudent.tsx',
  'roommates/colocathlonCard.tsx',
  'roommates/housingMap.tsx',
  'roommates/createHousing.tsx',
  'notification/deviceSubscribeButton.tsx',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    visualizer({ template: 'sunburst' }),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') }),
  ],
  base: '/static/',
  resolve: {
    alias: {
      '#api': path.resolve(__dirname, './src/api'),
      '#modules': path.resolve(__dirname, './src/modules'),
      '#pages': path.resolve(__dirname, './src/pages'),
      '#shared': path.resolve(__dirname, './src/shared'),
      '#types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
  },
  build: {
    outDir: path.join(__dirname, '../backend/static/front/'),
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: [
        path.join(__dirname, '/src/index.tsx'),
        ...legacyEntryPoints.map((p) => path.join(__dirname, '/src/legacy', p)),
      ],
    },
  },
});

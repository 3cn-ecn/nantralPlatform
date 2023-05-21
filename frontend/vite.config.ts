import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Entry points for legacy React components not yet compiled in the main one
const legacyEntryPoints = [
  // 'app/sw.ts',
  // 'app/app.ts',
  // 'club/clubsList.tsx',
  // 'group.old/eventsGroupListUpdate.tsx',
  // 'group/MembershipsGroup.tsx',
  // 'group/MembershipsStudent.tsx',
  // 'event/eventsView.tsx',
  // 'roommates/colocathlonCard.tsx',
  // 'roommates/housingMap.tsx',
  // 'roommates/createHousing.tsx',
  // 'notification/subscribeButton.tsx',
  // 'notification/deviceSubscribeButton.tsx',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), visualizer({ template: 'sunburst' })],
  base: '/static/',
  resolve: {
    alias: {
      '#api': path.resolve(__dirname, './src/api/'),
      '#components': path.resolve(__dirname, './src/components/'),
      '#i18n': path.resolve(__dirname, './src/i18n/'),
      '#modules': path.resolve(__dirname, './src/modules/'),
      '#pages': path.resolve(__dirname, './src/pages'),
      '#types': path.resolve(__dirname, './src/types'),
      '#utils': path.resolve(__dirname, './src/utils'),
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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

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

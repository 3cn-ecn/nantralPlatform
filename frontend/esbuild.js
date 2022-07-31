/**
 *
 * This script allows to transpile React elements of Nantral-Platform.
 * It will bundle and minify the file, and output them in backend/static/js.
 * Invoke it by running:
 *
 *        `node esbuild.js`
 *
 * It provides a dev and watch mode, by passing the argument
 * `dev` or `watch` when calling the script:
 *
 *        `node esbuild.js dev`
 *
 * DEV MODE: No minification, sourcemaps, no watch for changes.
 * WATCH MODE: No minification, sourcemaps, watch for changes.
 * PROD MODE: Minification and no sourcemaps.
 *
 * In order to add an entry to the file list, edit the entryPoints array.
 *
 * @summary ESBuild script file for the frontend React elements of Nantral-Platform.
 * @author Charles Zablit <zablitcharles@gmail.com>
 * @date July 2022
 */

import path from 'path';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsdir = path.join(__dirname, 'src/legacy');

const entryPoints = [
  'app/sw.ts',
  'app/app.ts',
  'club/clubsList.tsx',
  'group/eventsGroupListUpdate.tsx',
  'group/postsGroupListUpdate.tsx',
  'group/groupMembers.tsx',
  'group/editGroupMembers.tsx',
  'event/eventsView.tsx',
  'roommates/cowlocathlonCard.tsx',
  'roommates/housingMap.tsx',
  'roommates/createHousing.tsx',
  'notification/subscribeButton.tsx',
  'notification/deviceSubscribeButton.tsx',
  '../index.tsx',
];

// Parse arguments
const watch = process.argv[2] === 'watch';
const dev = process.argv[2] === 'dev';

esbuild
  .build({
    entryPoints: entryPoints.map((e) => path.join(appsdir, e)),
    bundle: true,
    sourcemap: dev || watch,
    minify: !dev && !watch,
    outdir: path.join(__dirname, '../backend/static/js'),
    logLevel: 'info',
    watch: watch,
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

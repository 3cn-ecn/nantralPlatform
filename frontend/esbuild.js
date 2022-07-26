/**
 *
 * This script allows to transpile React elements of Nantral-Platform.
 * Invoke it by running:
 *
 *        `node esbuild.js`
 *
 * It provides a watch mode, by passing the argument `watch` when
 * calling the script:
 *
 *        `node esbuild.js watch`
 *
 * In order to add an entry to the file list, edit the entryPoints array.
 *
 * @summary ESBuild script file for the frontend React elements of Nantral-Platform.
 * @author Charles Zablit <zablitcharles@gmail.com>
 * @date July 2022
 */

const path = require("path");

const appsdir = path.join(__dirname, "src/containers");

const entryPoints = [
  "app/sw.ts",
  "app/app.ts",
  "club/clubsList.tsx",
  "group/eventsGroupListUpdate.tsx",
  "group/postsGroupListUpdate.tsx",
  "group/groupMembers.tsx",
  "group/editGroupMembers.tsx",
  "event/eventsView.tsx",
  "roommates/cowlocathlonCard.tsx",
  "roommates/housingMap.tsx",
  "roommates/createHousing.tsx",
  "notification/subscribeButton.tsx",
  "notification/deviceSubscribeButton.tsx",
];

// Parse arguments
const watch = process.argv[2] === "watch";

require("esbuild")
  .build({
    entryPoints: entryPoints.map((e) => path.join(appsdir, e)),
    bundle: true,
    sourcemap: watch,
    minify: !watch,
    outdir: path.join(__dirname, "../backend/static/js"),
    logLevel: "info",
    format: "cjs",
    watch: watch,
  })
  .catch(() => process.exit(1));

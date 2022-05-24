var path = require("path");
var base_dir = path.join(__dirname, '..');
var apps_dir = path.join(base_dir, "src/components");
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'sw.js':                     path.join(apps_dir, "app/sw.ts"),
    'launchApp.js':              path.join(apps_dir, "app/app.ts"),
    'clubsList.js':              path.join(apps_dir, "club/clubsList.tsx"),
    'eventsGroupListUpdate.js':  path.join(apps_dir, "group/eventsGroupListUpdate.tsx"),
    'postsGroupListUpdate.js':   path.join(apps_dir, "group/postsGroupListUpdate.tsx"),
    'groupMembers.js':           path.join(apps_dir, "group/groupMembers.tsx"),
    'editGroupMembers.js':       path.join(apps_dir, "group/editGroupMembers.tsx"),
    'eventsView.js':             path.join(apps_dir, "event/eventsView.tsx"),
    'cowlocathlonCard.js':       path.join(apps_dir, "roommates/cowlocathlonCard.tsx"),
    'housingMap.js':             path.join(apps_dir, "roommates/housingMap.tsx"),
    'createHousing.js':          path.join(apps_dir, "roommates/createHousing.tsx"),
    'subscribeButton.js':        path.join(apps_dir, "notification/subscribeButton.tsx"),
    'deviceSubscribeButton.js':  path.join(apps_dir, "notification/deviceSubscribeButton.tsx"),
    'reactApp.js':               path.join(base_dir, "src/index.tsx"),
  },
  output: {
    path: path.join(base_dir, "../backend/static/js"),
    filename: "[name]",
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // 3. Inject styles into DOM
          "css-loader",   // 2. Turns css into commonjs
          "sass-loader",  // 1. Turns sass into css
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".js", ".json", ".ts", ".jsx"],
  },
};

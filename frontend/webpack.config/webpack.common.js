var path = require("path");
var base_dir = path.join(__dirname, '..');
var legacy = path.join(base_dir, "src/components/legacy");
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'sw.js':                     path.join(legacy, "app/sw.ts"),
    'launchApp.js':              path.join(legacy, "app/app.ts"),
    'clubsList.js':              path.join(legacy, "club/clubsList.tsx"),
    'eventsGroupListUpdate.js':  path.join(legacy, "group/eventsGroupListUpdate.tsx"),
    'postsGroupListUpdate.js':   path.join(legacy, "group/postsGroupListUpdate.tsx"),
    'groupMembers.js':           path.join(legacy, "group/groupMembers.tsx"),
    'editGroupMembers.js':       path.join(legacy, "group/editGroupMembers.tsx"),
    'eventsView.js':             path.join(legacy, "event/eventsView.tsx"),
    'cowlocathlonCard.js':       path.join(legacy, "roommates/cowlocathlonCard.tsx"),
    'housingMap.js':             path.join(legacy, "roommates/housingMap.tsx"),
    'createHousing.js':          path.join(legacy, "roommates/createHousing.tsx"),
    'subscribeButton.js':        path.join(legacy, "notification/subscribeButton.tsx"),
    'deviceSubscribeButton.js':  path.join(legacy, "notification/deviceSubscribeButton.tsx"),
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

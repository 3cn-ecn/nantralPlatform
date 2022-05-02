var path = require("path");
var apps_dir = path.join(__dirname, "../src/containers")

module.exports = {
  entry: {
    sw:                     path.join(apps_dir, "app/sw.ts"),
    app:                    path.join(apps_dir, "app/app.ts"),
    clubsList:              path.join(apps_dir, "club/clubsList.tsx"),
    eventsGroupListUpdate:  path.join(apps_dir, "group/eventsGroupListUpdate.tsx"),
    postsGroupListUpdate:   path.join(apps_dir, "group/postsGroupListUpdate.tsx"),
    groupMembers:           path.join(apps_dir, "group/groupMembers.tsx"),
    editGroupMembers:       path.join(apps_dir, "group/editGroupMembers.tsx"),
    eventsView:             path.join(apps_dir, "event/eventsView.tsx"),
    cowlocathlonCard:       path.join(apps_dir, "roommates/cowlocathlonCard.tsx"),
    housingMap:             path.join(apps_dir, "roommates/housingMap.tsx"),
    createHousing:          path.join(apps_dir, "roommates/createHousing.tsx"),
    subscribeButton:        path.join(apps_dir, "notification/subscribeButton.tsx"),
    deviceSubscribeButton:  path.join(apps_dir, "notification/deviceSubscribeButton.tsx")
  },
  output: {
    path: path.join(__dirname, "../../backend/static/js"),
    filename: "[name].js",
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".js", ".json", ".ts", ".jsx"],
  },
};

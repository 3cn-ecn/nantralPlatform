var path = require("path");
module.exports = {
  entry: {
    goBackButton: path.join(
      __dirname,
      "../src/containers/goBackButton.tsx"
    ),
    clubsList: path.join(__dirname, "../src/containers/clubsList.tsx"),
    eventsGroupListUpdate: path.join(
      __dirname,
      "../src/containers/eventsGroupListUpdate.tsx"
    ),
    postsGroupListUpdate: path.join(
      __dirname,
      "../src/containers/postsGroupListUpdate.tsx"
    ),
    eventsView: path.join(__dirname, "../src/containers/eventsView.tsx"),
    cowlocathlonCard: path.join(
      __dirname,
      "../src/containers/cowlocathlonCard.tsx"
    ),
    housingMap: path.join(__dirname, "../src/containers/housingMap.tsx"),
    createHousing: path.join(__dirname, "../src/containers/createHousing.tsx"),
    groupMembers: path.join(__dirname, "../src/containers/groupMembers.tsx"),
    editGroupMembers: path.join(
      __dirname,
      "../src/containers/editGroupMembers.tsx"
    ),
    subscribeButton: path.join(
      __dirname, 
      "../src/containers/subscribeButton.tsx"
    )
  },
  output: {
    path: path.join(__dirname, "../../server/static/js"),
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

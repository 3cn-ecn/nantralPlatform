var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
module.exports = {
  entry:  {
    studentCourseSelector: path.join(__dirname, '../src/containers/studentCourseSelector.tsx'),
    eventsGroupListUpdate: path.join(__dirname, '../src/containers/eventsGroupListUpdate.tsx'),
    postsGroupListUpdate: path.join(__dirname, '../src/containers/postsGroupListUpdate.tsx'),
    housingMap: path.join(__dirname, '../src/containers/housingMap.tsx'),
    createHousing: path.join(__dirname, '../src/containers/createHousing.tsx'),
    editHousing: path.join(__dirname, '../src/containers/editHousing.tsx')
  },
  output: {
    path: path.join(__dirname, '../../server/static/js'),
    filename: '[name].js'
  },  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json'
    }),
  ],
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: 'babel-loader',
        exclude: /node_modules/,
      },
			{
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  }
}
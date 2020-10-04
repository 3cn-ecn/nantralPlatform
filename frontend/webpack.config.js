var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
module.exports = {
  entry:  {
    index: path.join(__dirname, 'src/index'),
    studentCourseSelector: path.join(__dirname, 'src/containers/studentCourseSelector')
  },
  output: {
    path: path.join(__dirname, '../server/static/js'),
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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
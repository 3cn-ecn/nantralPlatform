const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");
const prod = require("./webpack.prod.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, prod, {
  plugins: [new BundleAnalyzerPlugin()],
});

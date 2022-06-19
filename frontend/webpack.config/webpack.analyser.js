import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
// eslint-disable-next-line import/extensions
import prod from './webpack.prod.js';

export default merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
});

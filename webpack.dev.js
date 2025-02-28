const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    // Automatically restart the server on changes
    new NodemonPlugin({
      watch: path.resolve('./dist'),
      ignore: ['*.js.map'],
      verbose: true,
      env: {
        NODE_ENV: 'development',
      },
    }),
  ],
});
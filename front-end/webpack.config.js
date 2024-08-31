const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  // Other Webpack configurations...
  module: {
    rules: [
      // Other rules...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          // Exclude specific modules
          /@chainsafe\/is-ip/,
          /dag-jose/,
        ],
      },
    ],
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  },
  // Other configurations...
};

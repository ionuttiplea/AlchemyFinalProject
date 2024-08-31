const {
  override,
  addWebpackAlias,
  addWebpackModuleRule,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
    '@types': path.resolve(__dirname, 'src/types'),
    '@abi': path.resolve(__dirname, 'src/abi'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  }),
  addWebpackModuleRule({
    test: /\.js$/,
    enforce: 'pre',
    use: [
      {
        loader: 'source-map-loader',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => {
            // Only include source maps for your code, ignore node_modules
            return !/node_modules/.test(resourcePath);
          },
        },
      },
    ],
  }),
);

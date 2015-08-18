'use strict';

module.exports = function(config) {
  config.module.loaders = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel!react-map-styles'
  }];
  return config;
};

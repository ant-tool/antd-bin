'use strict';

module.exports = {

  module: {

    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel!react-map-styles'
      }
    ]
  }
};

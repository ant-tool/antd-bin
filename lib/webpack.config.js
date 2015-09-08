'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var assign = require('object-assign');


module.exports = function(args) {

  var plugins = [
    new ExtractTextPlugin('[name].css', {
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/^xhr2$/)
  ];

  if (!args.debug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      output: {
        ascii_only: true
      }
    }));
  }

  return assign({}, require('./webpack.common.config'), {
    plugins: plugins
  });
};

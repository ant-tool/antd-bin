'use strict';

var join = require('path').join;
var webpack = require('webpack');
var printResult = require('./printResult');
var assign = require('object-assign');

module.exports = function () {
  var webpackConfig;

  try {
    webpackConfig = require(join(process.cwd(), 'webpack.dev.config.js'));
  } catch (e) {
    webpackConfig = require('./webpack.dev.config.js');

    try {
      webpackConfig = assign({}, webpackConfig,
        require(join(process.cwd(), 'webpack.dev.config.merge.js'))
      );
    } catch(e) {
    }
  }

  var compiler = webpack(webpackConfig);
  compiler.plugin('done', printResult);

  return require('koa-webpack-dev-middleware')(compiler, {
    publicPath: '/'
  });
};

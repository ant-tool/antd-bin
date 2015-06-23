'use strict';

var join = require('path').join;
var webpack = require('webpack');
var printResult = require('./printResult');

module.exports = function () {
  var webpackConfig;

  try {
    webpackConfig = require(join(process.cwd(), 'config/webpack.dev.config.js'));
  } catch (e) {
    webpackConfig = require('./webpack.dev.config.js');
  }

  var compiler = webpack(webpackConfig);
  compiler.plugin('done', printResult);

  return require('koa-webpack-dev-middleware')(compiler, {
    publicPath: '/'
  });
};

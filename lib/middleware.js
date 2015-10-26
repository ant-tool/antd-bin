'use strict';

var join = require('path').join;
var assign = require('object-assign');

module.exports = function (compiler, publicPath) {
  console.log('publicPath', publicPath);

  return require('koa-webpack-dev-middleware')(compiler, {
    publicPath: publicPath || '/',
    quiet: true
  });
};

'use strict';

var shelljs = require('shelljs');
var join = require('path').join;
var webpack = require('webpack');
var assign = require('object-assign');

module.exports = function() {
  var printResult = require('../lib/printResult');

  var cwd = process.cwd();
  shelljs.rm('-rf', join(cwd, './dist'));

  var webpackConfig;
  try {
    webpackConfig = require(join(cwd, 'webpack.config.js'));
  } catch(e) {
    webpackConfig = require('../lib/webpack.config.js');

    try {
      webpackConfig = assign({}, webpackConfig,
        require(join(process.cwd(), 'webpack.config.merge.js'))
      );
    } catch(e) {}
  }

  webpack(webpackConfig, function(err, stats) {
    printResult(stats);
    console.log(stats.toString());
    if (err) {
      console.error(err);
    }
  });
};

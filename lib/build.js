'use strict';

var shelljs = require('shelljs');
var join = require('path').join;
var webpack = require('webpack');
var assign = require('object-assign');

module.exports = function(args) {
  var printResult = require('../lib/printResult');

  var cwd = process.cwd();

  var webpackConfig;
  try {
    webpackConfig = require(join(cwd, 'webpack.config.js'));
  } catch(e) {
    webpackConfig = require('../lib/webpack.config.js')(args);

    try {
      var merge = require(join(process.cwd(), 'webpack.config.merge.js'));
      if (typeof merge === 'function') {
        webpackConfig = merge(webpackConfig);
      } else {
        webpackConfig = assign({}, webpackConfig, merge);
      }
    } catch(e) {}
  }

  if (args.outputPath) {
    console.log(args.outputPath);
    webpackConfig.output.path = args.outputPath;
  }

  shelljs.rm('-rf', join(cwd, webpackConfig.output.path));

  var compiler = webpack(webpackConfig);

  function doneHandler(err, stats) {
    printResult(stats);
    console.log(stats.toString());
    if (err) {
      console.error(err);
    }
  }

  if (args.watch) {
    compiler.watch(args.watch || 200,doneHandler);
  } else {
    compiler.run(doneHandler);
  }
};

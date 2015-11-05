var server = require('./server');
var join = require('path').join;
var resolve = require('path').resolve;
var relative = require('path').relative;
var exeq = require('exeq');
var chalk = require('chalk');
var green = chalk.green;
var gray = chalk.gray;
var cyan = chalk.cyan;

module.exports = function(config, callback) {

  var serverOpts = {
    port: config.port || 8015,
    generateCov: config.cov,
    forTest: true,
  };
  var url = 'http://127.0.0.1:' + serverOpts.port + '/__runner.html';
  var mocha = join(require.resolve('mocha-phantomjs'), '../../bin/mocha-phantomjs');
  var istanbul = join(require.resolve('istanbul'), '../lib/cli.js');
  var hook = require.resolve('mocha-phantomjs-istanbul');

  server(serverOpts, function(app) {
    var cmds = [];
    if (config.cov) {
      url = url + '?cov --hooks ' + hook;
    }
    cmds.push(mocha + ' ' + url);
    if (config.cov) {
      cmds.push(istanbul + ' report lcov json-summary --include coverage/coverage.json');
    }

    exeq(cmds).then(function() {

      if (config.cov) {
        console.log();
        var covJSON = require(resolve('coverage/coverage-summary.json'));
        var summary = {
          lines: {total: 0, covered: 0},
          statements: {total: 0, covered: 0},
          functions: {total: 0, covered: 0},
          branches: {total: 0, covered: 0}
        };
        for (var file in covJSON) {
          ['lines', 'statements', 'functions', 'branches'].forEach(function (key) {
            summary[key].total += covJSON[file][key].total;
            summary[key].covered += covJSON[file][key].covered;
          });
        }
        var percentage = Math.round(100 * summary.lines.covered / summary.lines.total) + '%';
        if (summary.lines.total === 0) {
          percentage = '0%';
        }
        console.log('  ' + green(percentage) + ' coverage, ' +
        green(summary.lines.covered.toString()) + ' lines covered');
        for (file in covJSON) {
          console.log('    ' + gray(relative(process.cwd(), file)) + ': ' +
            green(covJSON[file].lines.pct + '% ') + gray('coverage ') +
            green(covJSON[file].lines.covered.toString()) + gray(' lines covered ')
          );
        }
        console.log(cyan('  You can see more detail in ' + 'coverage/lcov-report/index.html'));
        console.log();
      }

      app.close(function() {
        callback();
      });
    }, function(e) {
      console.log(e);
      callback();
    });
  });
};

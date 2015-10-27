var server = require('./server');
var join = require('path').join;
var exeq = require('exeq');

module.exports = function(config, callback) {

  var serverOpts = {
    port: config.port || 8015,
  };
  var url = 'http://127.0.0.1:' + serverOpts.port + '/__runner.html';
  var mocha = join(require.resolve('mocha-phantomjs'), '../../bin/mocha-phantomjs');

  server(serverOpts, function(app) {
    var cmds = [
      mocha + ' ' + url,
    ];
    exeq(cmds).then(function(results) {
      app.close(function() {
        callback();
      });
    }, function(e) {
      console.log(e);
      callback();
    });
  });
};

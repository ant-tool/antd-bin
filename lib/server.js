'use strict';

var socketio = require('socket.io');
var http = require('http');
var webpack = require('webpack');
var printResult = require('./printResult');

module.exports = function(args) {
  args = args || {};
  args.port = args.port || 8000;
  args.cwd = args.cwd || process.cwd();

  var koa = require('koa');
  var app = koa();
  var _stats;
  var io;

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

  if (args.hot) {
    var entry = webpackConfig.entry;
    for (var k in entry) {
      entry[k] = [].concat(entry[k], [
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:8000'
      ]);
    }

    var loaders = webpackConfig.module.loaders;
    loaders.forEach(function(loader) {
      if (loader.test.toString().indexOf('.jsx') > -1) {
        loader.loaders.unshift('react-hot');
      }
    });

    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  }

  var compiler = webpack(webpackConfig);
  compiler.plugin('done', function(stats) {
    printResult(stats);
    if (args.hot) {
      _sendStats(io.sockets, stats.toJson());
      _stats = stats;
    }
  });
  var invalidPlugin = function() {
    if (io) io.sockets.emit("invalid");
  };
  compiler.plugin("compile", invalidPlugin);
  compiler.plugin("invalid", invalidPlugin);

  app.use(require('./middleware')(compiler));
  app.use(require('koa-static')(args.cwd));
  app.use(require('koa-serve-index')(args.cwd, {
    hidden: true,
    view: 'details'
  }));

  var server = http.createServer(app.callback());
  server.listen(args.port, function() {
    console.log('listened on %s', args.port);
  });

  if (args.hot) {
    io = socketio.listen(server, {
      "log level": 1
    });
    io.sockets.on("connection", function (socket) {
      socket.emit("hot");
      if (!_stats) return;
      _sendStats(socket, _stats.toJson(), true);
    }.bind(this));
  }
};

function _sendStats(socket, stats, force) {
  if(!force && stats && (!stats.errors || stats.errors.length === 0) && stats.assets && stats.assets.every(function(asset) {
      return !asset.emitted;
    })) return socket.emit("still-ok");;
  socket.emit("hash", stats.hash);
  if(stats.errors.length > 0)
    socket.emit("errors", stats.errors);
  else if(stats.warnings.length > 0)
    socket.emit("warnings", stats.warnings);
  else
    socket.emit("ok");
}

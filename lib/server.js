'use strict';

var http = require('http');
var webpack = require('webpack');
var printResult = require('antd-build/lib/printResult');
var assign = require('object-assign');
var join = require('path').join;
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var glob = require('glob');

module.exports = function(args, callback) {
  args = args || {};
  args.port = args.port || 8000;
  args.cwd = args.cwd || process.cwd();

  var koa = require('koa');
  var app = koa();
  var io;

  var webpackConfig;
  try {
    webpackConfig = require(join(process.cwd(), 'webpack.dev.config.js'));
  } catch (e) {
    webpackConfig = require('./webpack.dev.config.js');

    var merge = _getMergeConfig();
    if (typeof merge === 'function') {
      webpackConfig = merge(webpackConfig);
    } else {
      webpackConfig = assign({}, webpackConfig, merge);
    }
  }

  if (args.generateCov) {
    webpackConfig.module = assign({}, webpackConfig.module, {
      postLoaders: [
        {
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: 'istanbul-instrumenter',
        }
      ],
    });
    webpackConfig.resolveLoader = assign({}, webpackConfig.resolveLoader, {
      modulesDirectories: [
        'node_modules',
        join(__dirname, '../node_modules'),
      ],
    });
  }

  if (args.forTest) {
    webpackConfig.entry = {
      __test: glob.sync('./test/**/*-spec.js', {
        cwd: args.cwd,
      }),
    };
  }

  webpackConfig.plugins.push(
    new ProgressPlugin(function(percentage, msg) {
      var stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(msg);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('\nwebpack: bundle build is now finished.');
      }
    })
  );

  var compiler = webpack(webpackConfig);
  compiler.plugin('done', function(stats) {
    printResult(stats);
  });
  var invalidPlugin = function() {
    if (io) io.sockets.emit("invalid");
  };
  compiler.plugin("compile", invalidPlugin);
  compiler.plugin("invalid", invalidPlugin);

  app.use(require('./middleware')(compiler, args.publicPath));
  app.use(require('koa-static')(join(__dirname, 'public')));
  app.use(require('koa-static')(args.cwd));
  app.use(require('koa-serve-index')(args.cwd, {
    hidden: true,
    view: 'details'
  }));

  var server = http.createServer(app.callback());
  server.listen(args.port, function() {
    console.log('listened on %s', args.port);

    if (args.proxy) {
      var anyproxy;
      try {
        anyproxy = require('anyproxy');
      } catch(e) {
        log.error('error', 'npm install anyproxy -g to enable proxy');
        process.exit(1);
      }

      !anyproxy.isRootCAFileExists() && anyproxy.generateRootCA();

      var ip = require('internal-ip')();
      new anyproxy.proxyServer({
        type: 'http',
        port: 8989,
        hostname: 'localhost',
        rule: require('./rule')({
          rootDir: typeof args.proxy === 'string' ? args.proxy : '/',
          port: args.port,
          hostname: ip
        })
      });
    }

    if (callback) {
      callback(server);
    }
  });
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

function _getMergeConfig() {
  try {
    return require(join(process.cwd(), 'webpack.dev.config.merge.js'));
  } catch(e) {
    try {
      return require(join(process.cwd(), 'webpack.config.merge.js'));
    } catch(e) {
      return {};
    }
  }
}

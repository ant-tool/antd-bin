'use strict';

module.exports = function(args) {
  args = args || {};
  args.port = args.port || 8000;
  args.cwd = args.cwd || process.cwd();

  var koa = require('koa');
  var app = koa();

  app.use(require('./middleware')());
  app.use(require('koa-static')(args.cwd));
  app.use(require('koa-serve-index')(args.cwd, {
    hidden: true,
    view: 'details'
  }));

  app.listen(args.port, function() {
    console.log('listened on %s', args.port);
  });
};

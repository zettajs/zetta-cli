var spdy = require('spdy');
var argo = require('argo');
var WebSocket = require('./web_socket');
var pubsub = require('./pubsub_service');

var Logger = require('./logger');
var l = Logger();

module.exports = function(argo, wss, cb) {
  var ws = new WebSocket(wss);

  ws.on('error', function(e) {
    console.error('error:', e);
  });

  var app = argo
    .use(function(handle) {
      handle('request', function(env, next) {
        var id = env.request.headers['elroy-message-id'];
        env.response.setHeader('elroy-message-id', id);

        next(env);
      });
      handle('response', function(env, next) {
        next(env);
      });
    })
    .build();

  var server = spdy.createServer({
    windowSize: 1024 * 1024,
    plain: true,
    ssl: false
  }, app.run);

  ws.on('open', function(socket) {
    server.emit('connection', socket);
  });
  
  cb(server);
};

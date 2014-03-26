var spdy = require('spdy');
var argo = require('argo');
var WebSocket = require('./web_socket');
var pubsub = require('./pubsub_service');

var Logger = require('./logger');
var l = Logger();

var connected = false;
var interval = null;

var RETRY_INTERVAL = 3000;

function createSocket(url, server) {
  var ws = new WebSocket(url);
  ws.on('open', function(socket) {
    connected = true;
    l.emit('log', 'cloud-client', 'Cloud connection established (' + url + ')');
    server.emit('connection', socket);
  });

  ws.on('error', function(err) {
    connected = false;
    l.emit('log', 'cloud-client', 'Cloud connection error (' + url + '): ' + err);
    reconnect();
  });

  ws.on('close', function() {
    connected = false;
    l.emit('log', 'cloud-client', 'Cloud connection closed (' + url + ')');
    reconnect();
  });

  function reconnect() {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(function() {
      if (connected) {
        clearInterval(interval);
      } else {
        createSocket(url, server);
      }
    }, RETRY_INTERVAL);
  };
};

module.exports = function(argo, url, cb) {
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

  createSocket(url, server);
  
  cb(server);
};

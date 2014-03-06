var spdy = require('spdy');
var argo = require('argo');
var WebSocket = require('ws');
var FakeSocket = require('./fake_socket');
var pubsub = require('./pubsub_service');

module.exports = function(argo, url, cb) {
  var ws = new WebSocket(url);

  var app = argo
    .use(function(handle) {
      handle('request', function(env, next) {
        var id = env.request.headers['elroy-message-id'];
        env.response.setHeader('elroy-message-id', id);

        next(env);
      });
    })
    .build();

  var server = spdy.createServer({
    windowSize: 1024 * 1024,
    plain: true,
    ssl: false
  }, app.run);

  ws.on('open', function() {
    pubsub.setSocket(ws);
  });

  ws.on('error', function(e) {
    console.error(e.stack);
  });

  var fake = new FakeSocket();

  fake.onwrite = function(data) {
    ws.send(data, { binary: true });
  };

  ws.on('message', function(data) {
    fake.source.write(data);
  });
  
  server.emit('connection', fake);
  
  cb(server);
};

var spdy = require('spdy');
var argo = require('argo');
var Websocket = require('elroy-ws-reconnect');
//var WebSocket = require('ws');
var pubsub = require('./pubsub_service');

var Logger = require('./logger');
var l = Logger();

module.exports = function(argo, wss, cb) {
  var ws = new Websocket(wss,{pingInterval : 5000});
  //var ws = new WebSocket(url);
  pubsub.setSocket(ws);

  ws.on('connect', function(socket) {
    l.emit('log', 'cloud-client', 'Connection made to the cloud. '+wss);
  });

  ws.on('disconnect', function(err) {
    l.emit('log', 'cloud-client', 'Disconnected from the cloud server. '+wss );

  ws.on('error', function(e) {
    console.log('error');
    console.log(e);
  });

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

  server.emit('connection', fake);
  
  ws.on('message', function(data) {
    fake.source.write(data);
  });
  
  cb(server);
};

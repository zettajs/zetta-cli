var http = require('http');
var argo = require('argo');
var Websocket = require('elroy-ws-reconnect');
var FakeSocket = require('./fake_socket');
var pubsub = require('./pubsub_service');

var Logger = require('./logger');
var l = Logger();

module.exports = function(argo, wss, cb) {

  var ws = new Websocket(wss,{pingInterval : 5000});
  pubsub.setSocket(ws);

  ws.on('connect', function(socket) {
    l.emit('log', 'cloud-client', 'Connection made to the cloud. '+wss);
  });

  ws.on('disconnect', function(err) {
    l.emit('log', 'cloud-client', 'Disconnected from the cloud server. '+wss );
  });

  var app = argo
    .use(function(handle) {
      handle('request', function(env, next) {
        var id = env.request.headers['elroy-message-id'];
        env.response.setHeader('elroy-message-id', id);

        next(env);
      });
    })
    .use(function(handle) {
      handle('request', function(env, next) {
        if (env.request.socket.source) {
          env.response.on('finish', function() {
              ws.send(env.request.socket.source.buffer.join('').toString());
          });
        }

        next(env);
      });
    })
    .build();

  var server = http.createServer(app.run);

  ws.on('message', function(data) {
    var fake = new FakeSocket();
    fake.write(data);
    fake.emit('finish');
    fake.on('readable', function() {
      var data;
      while (data = fake.read()) {
        this.ondata(data, 0, data.length);
      }
    });

    server.emit('connection', fake);
  });

  cb(server);
};

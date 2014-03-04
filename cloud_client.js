var http = require('http');
var argo = require('argo');
var WebSocket = require('ws');
var FakeSocket = require('./fake_socket');

module.exports = function(argo, wss, cb) {
  var ws = new WebSocket(wss);

  var app = argo
    .use(function(handle) {
      handle('request', function(env, next) {
        env.response.on('finish', function() {
          ws.send(env.request.socket.source.buffer.join('').toString());
        });
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

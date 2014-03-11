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
        console.log('in request handler');
        var id = env.request.headers['elroy-message-id'];
        env.response.setHeader('elroy-message-id', id);

        next(env);
      });
      handle('response', function(env, next) {
        //console.log('source buffer:', fake.source.buffer);
        //console.log('source buffer length:', fake.source.buffer.length);
        next(env);
      });
    })
    .build();

  var server = spdy.createServer({
    windowSize: 1024 * 1024,
    plain: true,
    ssl: false
  }, app.run);

  server.on('stream', function(socket) {
    console.log('on stream!');
  });

  ws.on('open', function() {
    pubsub.setSocket(ws);
    //server.emit('connection', fake);
    server.emit('connection', ws._socket);
  });

  ws.on('error', function(e) {
    console.error(e.stack);
  });

  /*var fake = new FakeSocket();

  fake.onwrite = function(data) {
    console.log('fake.onwrite');
    ws.send(data, { binary: true });
  };*/

  ws.on('message', function(data) {
    console.log('on message');
    //fake.source.write(data);
  });
  
  cb(server);
};

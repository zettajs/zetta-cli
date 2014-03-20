var spdy = require('spdy');
var argo = require('argo');
//var WebSocket = require('elroy-ws-reconnect');
var WebSocket = require('ws');
var pubsub = require('./pubsub_service');

var Logger = require('./logger');
var l = Logger();

module.exports = function(argo, wss, cb) {
  var ws = new WebSocket(wss,{pingInterval : 5000});
  //var ws = new WebSocket(url);
  //pubsub.setSocket(ws);

  /*ws.on('connect', function(socket) {
    l.emit('log', 'cloud-client', 'Connection made to the cloud. '+wss);
  });

  ws.on('disconnect', function(err) {
    l.emit('log', 'cloud-client', 'Disconnected from the cloud server. '+wss );
  });*/

  ws.on('error', function(e) {
    console.log('error');
    console.log(e);
  });

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

  ws.on('open', function() {
    //pubsub.setSocket(ws);
    //server.emit('connection', fake);
    //console.log(ws._socket);
    /*ws._socket.on('data', function(chunk) {
      console.log(chunk.length);
      console.log(chunk.toString());
    });*/
    /*ws._socket.on('readable', function() {
      var data;
      while (data = ws._socket.read()) {
        console.log(data);
      }
    });*/
    ws._socket.removeAllListeners();
    server.emit('connection', ws._socket);
  });

  /*ws.on('error', function(e) {
    console.error(e.stack);
  });*/

  /*var fake = new FakeSocket();

  fake.onwrite = function(data) {
    console.log('fake.onwrite');
    ws.send(data, { binary: true });
  };*/

  /*ws.on('message', function(data) {
    console.log('on message');
    console.log(data);
    //fake.source.write(data);
  });*/
  
  cb(server);
};

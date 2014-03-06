//var http = require('http');
var spdy = require('spdy');
var argo = require('argo');
var WebSocket = require('ws');
//var FakeSocket = require('./fake_socket');
var FakeSocket = require('./fake_socket');
var pubsub = require('./pubsub_service');
var PassThrough = require('stream').PassThrough;

var Logger = require('./logger');
var l = Logger();

module.exports = function(argo, wss, cb) {
  var ws = new WebSocket(wss);

  ws.on('error', function(e) {
    console.log('error');
    console.log(e);
  });

  var app = argo
    .use(function(handle) {
      handle('request', function(env, next) {
        //console.log('in fog request');
        var id = env.request.headers['elroy-message-id'];
        env.response.setHeader('elroy-message-id', id);

        next(env);
      });
      handle('response', { affinity: 'sink' }, function(env, next) {
        fake.source.buffer = [];
        fake.dest.buffer = [];
        next(env);
      });
    })
    .use(function(handle) {
      handle('request', function(env, next) {
        /*if (env.request.socket.source) {
          env.response.on('finish', function() {
              //ws.send(env.request.socket.source.buffer.join('').toString());
          });
        }*/

        next(env);
      });
    })
    .build();

  //var server = http.createServer(app.run);
  var server = spdy.createServer({
    windowSize: 1024 * 1024,
    plain: true,
    ssl: false,
    //autoSpdy31: true
  }, app.run);

  ws.on('open', function() {
    pubsub.setSocket(ws);
  });

  //ws.setTimeout = function() {};
  
  //var fake = new PassThrough();//new FakeSocket();
  //['setTimeout', 'destroy', 'destroySoon'].forEach(function(key) {
    //fake[key] = function() {};
  //});

  var fake = new FakeSocket();
  /*fake.ondata = function(chunk, start, end) {
    console.log('chunk:', chunk);
    console.log('start:', start);
    console.log('end:', end);
    var data = chunk.slice(start, end - start);
    console.log('sending:', data);
    ws.send(data, { binary: true });
  };*/

  fake.ondata = function(chunk, start, end) {
    //console.log('FAKE ON DATA');
    //ws.send(chunk.slice(start, end - start), { binary: true });
  };

  fake.onwrite = function(data) {
    ws.send(data, { binary: true });
  };

  fake.onend = function() {
    console.log('ending');
    fake.source.buffer = [];
    fake.dest.buffer = [];
    fake.end();
  };

  server.emit('connection', fake);
  
  //fake.once('data', function() { });
  /*fake.on('readable', function() {
    console.log('readable');
    var data;
    while (data = fake.read()) {
      console.log('reading:', data);
      //this.ondata(data, 0, data.length);
      ws.send(data, { binary :true });
    }
  });*/

  /*fake.on('data', function(chunk) {
    console.log('on data:', chunk);
  });*/
  ws.on('message', function(data) {
    //console.log('receiving:', data);
    fake.source.write(data);
    fake.read(0);
    //fake.emit('data', data);
    //fake.emit('readable', data);
    //server.emit('data', data);
    /*var fake = new FakeSocket();
    fake.write(data);
    fake.emit('finish');
    fake.on('readable', function() {
      var data;
      while (data = fake.read()) {
        console.log(data);
        this.emit('data', data);
        //this.ondata(data, 0, data.length);
      }
    });

    server.emit('connection', fake);*/
  });
  

  cb(server);
};

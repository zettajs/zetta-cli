var fs = require('fs');
var path = require('path');
var argo = require('argo');
var spdy = require('spdy');
var titan = require('titan');
var siren = require('argo-formatter-siren');
var multiparty = require('argo-multiparty');
var CloudClient = require('./cloud_client');
var FogRuntime = require('./fog_runtime');
var PubSubResource = require('./pubsub_resource');
var Logger = require('./logger');

module.exports = function run(appName){

  var file = appName || 'app';

  var app = path.resolve(file);
  var dir = path.dirname(app);
  var app = require(app);

  var scouts = fs.readdirSync(path.join(dir, 'scouts')).filter(function(scoutPath) {
    if (/^.+\.js$/.test(scoutPath)) {
      return scoutPath;
    }
  }).map(function(scoutPath) {
    return require(path.join(dir, 'scouts', scoutPath));
  });

  //Wire up the logger here.
  var l = Logger();

  var server = argo()
    .use(function(handle) {
      handle('request', function(env, next) {
        next(env);
      });
    })
    .use(titan)
    .allow('*')
    .use(multiparty)
    .add(PubSubResource)
    .format({ directory : path.join(__dirname,'api_formats'), engines: [siren], override: {'application/json': siren}});
    //.logger();


  l.emit('log', 'fog-bootstrapper', 'bootstrapping fog siren hypermedia API.');
  var fog = new FogRuntime(server, scouts);
  fog.init(function(err) {
    var apps = [app];
    fog.loadApps(apps, function() {
      var host = process.env.ELROY_CLOUD || 'ws://elroy-cloud.herokuapp.com';
      l.emit('log', 'fog-bootstrapper', 'connecting to cloud endpoint at: '+host+' via websocket');
      CloudClient(server, host, function(server){
        server.listen(3002);
      });
    });
  });

};

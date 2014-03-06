var fs = require('fs');
var path = require('path');
var argo = require('argo');
var titan = require('titan');
var siren = require('argo-formatter-siren');
var CloudClient = require('./cloud_client');
var FogRuntime = require('./fog_runtime');
var PubSubResource = require('./pubsub_resource');

module.exports = function run(dir){

  var app = require(path.join(dir, 'app'));

  var scouts = fs.readdirSync(path.join(dir, 'scouts')).filter(function(scoutPath) {
    if (/^.+\.js$/.test(scoutPath)) {
      return scoutPath;
    }
  }).map(function(scoutPath) {
    return require(path.join(dir, 'scouts', scoutPath));
  });

  var server = argo()
    .use(titan)
    .allow('*')
    .add(PubSubResource)
    .format({ directory : path.join(__dirname,'api_formats'), engines: [siren], override: {'application/json': siren}})
    .logger();

  var fog = new FogRuntime(server, scouts);
  fog.init(function(err) {
    var apps = [app];
    fog.loadApps(apps, function() {
      var host = 'ws://elroy-cloud.herokuapp.com';        
      //var host = 'ws://localhost:3000';
      CloudClient(server, host, function(server){
        server.listen(3002);
      });
    });
  });

};




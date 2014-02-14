var fs = require('fs');
var path = require('path');
var argo = require('argo');
var titan = require('titan');
var siren = require('argo-formatter-siren');



var FogServer = require('./fog_server');

var dir = './app';

var app = require(dir + '/app');

var scouts = fs.readdirSync(dir + '/scouts').filter(function(scoutPath) {
  if (/^.+\.js$/.test(scoutPath)) {
    return scoutPath;
  }
}).map(function(scoutPath) {
  return require(dir + '/scouts/' + scoutPath);
});

var server = argo()
  .use(titan)
  .allow('*')
  .format({ directory : path.join(__dirname,'api_formats'), engines: [siren], override: {'application/json': siren}})
  .logger();

var fog = new FogServer(server, scouts);
fog.init(function(err) {
  var apps = [app];
  fog.loadApps(apps);

  server.listen(3002);
});

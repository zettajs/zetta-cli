var fs = require('fs');
var path = require('path');
var argo = require('argo');
var titan = require('titan');

var FogServer = require('./fog_server');

var dir = path.join(__dirname, 'app');

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
  .logger();

var fog = new FogServer(server, scouts);
fog.init(function(err) {
  var apps = [app];
  fog.loadApps(apps);

  server.listen(3002);
});

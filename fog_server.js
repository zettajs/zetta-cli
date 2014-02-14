var FogAppLoader = require('./fog_app_loader');
var Scientist = require('./scientist');
var DevicesResource = require('./api_resources/devices');

var FogServer = module.exports = function(argo, scouts) {
  this.argo = argo;
  this.devices = [];
  this.scouts = scouts;
};

FogServer.prototype.init = function(cb) {
  var self = this;

  self.argo
    .add(DevicesResource, self.devices)

  var count = 0;
  var max = this.scouts.length;
  this.scouts.forEach(function(scout) {
    scout.list(function(err, devices) {
      devices.forEach(function(device) {
        var machine = Scientist.configure(device);
        self.devices.push(machine);
      });

      count++;
      if (count === max) {
        cb();
      }
    });
  });


};

FogServer.prototype.loadApp = function(resources) {
  var self = this;
  resources.forEach(function(resource) {
    self.argo.add(resource);
  });
};

FogServer.prototype.loadApps = function(apps) {
  var self = this;
  apps.forEach(function(constructor) {
    var app = new constructor();
    var loader = new FogAppLoader(self);
    loader.load(app);
  });
};

FogServer.prototype.findDevice = function(id) {
  var device = this.devices.filter(function(device) {
    return device.name === id;
  });

  return device.length ? device[0] : null;
};

var FogAppLoader = require('./fog_app_loader');
var Scientist = require('./scientist');

var FogRuntime = module.exports = function(argo, scouts) {
  this.argo = argo;
  this.devices = [];
  this.scouts = scouts;
};

FogRuntime.prototype.init = function(cb) {
  var self = this;
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

FogRuntime.prototype.loadApp = function(resources) {
  var self = this;
  resources.forEach(function(resource) {
    self.argo.add(resource);
  });
};

FogRuntime.prototype.loadApps = function(apps) {
  var self = this;
  apps.forEach(function(constructor) {
    var app = new constructor();
    var loader = new FogAppLoader(self);
    loader.load(app);
  });
};

FogRuntime.prototype.findDevice = function(id) {
  var device = this.devices.filter(function(device) {
    return device.name === id;
  });

  return device.length ? device[0] : null;
};

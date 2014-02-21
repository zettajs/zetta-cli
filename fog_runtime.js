var FogAppLoader = require('./fog_app_loader');
var Scientist = require('./scientist');
var DevicesResource = require('./api_resources/devices');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Registry = require('./registry');

var FogRuntime = module.exports = function(argo, scouts) {
  this.argo = argo;
  this.scouts = scouts;
  this.registry = new Registry();
};
util.inherits(FogRuntime, EventEmitter);

FogRuntime.prototype.deviceInRegistry = function(device,compare){
  var found = this.registry.devices.filter(function(b){
    if(b.type !== device.type)
      return false;

    // scout does not provide a compare func.
    if(!compare)
      return device.name === b.name;

    return compare(device,b)
  });
  return found.length !== 0;
};


FogRuntime.prototype.init = function(cb) {
  var self = this;

  self.argo
    .add(DevicesResource, self.registry.devices)

  this.registry.load(function(err){
    if(err){
      console.log('Failed to load registry. Creating new one.');
    }
    self.loadScouts(cb);
  });
};

FogRuntime.prototype.loadScouts = function(cb) {
  var self = this;
  var count = 0;
  var max = this.scouts.length;
  this.scouts.forEach(function(scout) {
    scout = new scout();
    scout.init(self.registry,function(err){
      if(err)
        throw err;

      scout.on('discover', function() {
        var machine = Scientist.configure.apply(null,arguments);
        var found = self.deviceInRegistry(machine,scout.compare);
        if(!found){
          self.registry.add(machine,function(){
            self.emit('deviceready', machine);
          });
        }
      });

      count++;
      if (count == max) {
        cb();
      }
    });
  });
};

FogRuntime.prototype.loadApp = function(resource) {
  this.argo.add(resource);
};

FogRuntime.prototype.loadApps = function(apps, cb) {
  var self = this;
  var count = 0;
  var length = apps.length;
  apps.forEach(function(constructor) {
    var app = new constructor();
    var loader = new FogAppLoader(self);
    loader.load(app);

    count++;
    if (count === length) {
      cb();
    }
  });
};

FogRuntime.prototype.find = function(query, cb) {
  var q = query.split(':');
  if(q[0] === 'device'){
    var type = q[1];
    var search = q[2];
    var ret = this.registry.devices.filter(function(device){
      if(type === device.type){
        if(search === '*' || search === this.name)
          return true;
        return false;
      }
    });
    return cb(null,ret);  
  }
  cb(null,[]);
};

FogRuntime.prototype.get = function(id, cb) {

  var device = this.registry.devices.filter(function(device) {
    return device.name === id;
  });

  if(device.length) {
    setImmediate(function() { cb(null, device[0]); });
  } else {  
    this.on('deviceready', function(device){
      if(device.name === id) {
        setImmediate(function() { cb(null, device); });
      }
    });
  }
  
};

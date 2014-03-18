var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Rx = require('rx');
var DevicesResource = require('./api_resources/devices');
var FogAppLoader = require('./fog_app_loader');
var Logger = require('./logger');
var Observable = require('./observable');
var Registry = require('./registry');
var Scientist = require('./scientist');

var l = Logger();

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

    return compare(device,b);
  });
  return found.length !== 0;
};


FogRuntime.prototype.init = function(cb) {
  var self = this;

  self.argo
    .add(DevicesResource, self.registry.devices);

  this.registry.load(function(err){
    if(err){
      l.emit('log', 'fog-device-registry', 'Failed to load registry. Creating a new one.');
      //console.error('Failed to load registry. Creating new one.');
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

    scout.on('discover', function() {
      var machine = Scientist.configure.apply(null,arguments);
      var found = self.deviceInRegistry(machine,scout.compare);
      l.emit('log', 'fog-runtime', 'Discovered new device '+machine.type);
      if(!found){
        self.registry.add(machine,function(){
          l.emit('log', 'fog-runtime', 'Device ready '+machine.type);
          self.emit('deviceready', machine);

        });
      }
    });

    scout.init(function(err){
      if(err)
        throw err;

      setImmediate(function(){
        self.registry.json_devices.forEach(function(device){
          if(scout.drivers.indexOf(device.type) === -1)
            return;

          var ret = scout.provision(device);
          if(!ret)
            return;

          var machine = Scientist.configure.apply(null,ret);
          self.registry.devices.push(machine);
          l.emit('log', 'fog-runtime', 'Device ready '+machine.type+' initialized from registry');
          self.emit('deviceready', machine);
        });
      });
      
    });

    count++;
    if (count == max) {
      cb();
    }

  });
};

FogRuntime.prototype.loadApp = function(resource) {
  this.argo.add(resource);
};

FogRuntime.prototype.loadApps = function(apps, cb) {
  var self = this;
  var length = apps.length;

  apps.forEach(function(constructor) {
    var app = new constructor();
    var loader = new FogAppLoader(self);
    loader.load(app);
  });

  cb();
};

var observableCallback = function(query, runtime, registry, logger) {
  function fn(observer) {
    // TODO: Make this use a real query language.
    var pair = query.split('=');
    var key = pair[0];
    var value = JSON.parse(pair[1]);

    var devices = registry.devices
      .filter(function(device) {
        return device[key] === value;
      })
      .forEach(function(device) {
        setImmediate(function() { observer.onNext(device); });
      });

    var getDevice = function(device){
      if(device[key] === value) {
        logger.emit('log', 'fog-runtime', 'Device retrieved '+device.name);
        observer.onNext(device);
      }
    }

    runtime.on('deviceready', getDevice);

    return function() {
      runtime.removeListener('deviceready', getDevice);
    };
  }

  return fn;
};

FogRuntime.prototype.get = function(name, cb) {
  //var observable = new Observable('name="' + name + '"', this).first();
  var query = 'name="' + name + '"';
  var observable = Rx.Observable.create(observableCallback(query, this, this.registry, l));

  if (cb) {
    observable.subscribe(cb);
  }

  return observable;
};

FogRuntime.prototype.observe = function(query) {
  //return new Observable(query, this);
  return Rx.Observable.create(observableCallback(query, this, this.registry, l));
};

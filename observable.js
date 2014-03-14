var Logger = require('./logger');

var Observable = module.exports = function(query, runtime) {
  this.query = query;
  this.runtime = runtime;
  this.registry = this.runtime.registry;
  this.logger = new Logger();
  this.state = 'ready'; // disposed
};

Observable.prototype.subscribe = function(cb) {
  var self = this;

  // TODO: Make this use a real query language.
  var type = this.query.split('"')[1];

  var devices = this.registry.devices
    .filter(function(device) {
      return device.type === type;
    })
    .forEach(function(device) {
      setImmediate(function() { cb(null, device); });
    });

  var getDevice = function(device){
    if (self.state === 'disposed') {
      self.runtime.removeListener('deviceready', getDevice);
      return;
    }

    if(device.type === type) {
      self.logger.emit('log', 'fog-runtime', 'Device retrieved '+device.name);
      cb(null, device);
    }
  }

  this.runtime.on('deviceready', getDevice);
};

Observable.prototype.dispose = function() {
  this.state = 'disposed';
};

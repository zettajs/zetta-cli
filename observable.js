var Logger = require('./logger');

var Observable = module.exports = function(query, runtime) {
  this.query = query;
  this.runtime = runtime;
  this.registry = this.runtime.registry;
  this.logger = new Logger();
  this.state = 'ready'; // disposed
  this.remainder = null;
  this.expirationTimeout = null;
};

Observable.prototype.subscribe = function(cb) {
  var self = this;

  // TODO: Make this use a real query language.
  var pair = this.query.split('=');
  var key = pair[0];
  var value = JSON.parse(pair[1]);

  var devices = this.registry.devices
    .filter(function(device) {
      return device[key] === value;
    })
    .forEach(function(device) {
      setImmediate(function() { cb(null, device); });
    });

  var getDevice = function(device){
    if (self.state === 'disposed') {
      self.runtime.removeListener('deviceready', getDevice);
      return;
    }

    if(device[key] === value) {
      self._clearTimeout();
      if (self.remainder !== null) {
        self.remainder--;
        if (self.remainder === 0) {
          self.dispose();
        }
      }
      self.logger.emit('log', 'fog-runtime', 'Device retrieved '+device.name);
      cb(null, device);
    }
  }

  this.runtime.on('deviceready', getDevice);

  return this;
};

Observable.prototype.take = function(limit) {
  this.remainder = limit;
  return this;
};

Observable.prototype.first = function() {
  return this.take(1);
};

Observable.prototype.timeout = function(fn, ms) {
  var self = this;
  this.expirationTimeout = setTimeout(fn, ms);
  return this;
};

Observable.prototype._clearTimeout = function() {
  if (this.expirationTimeout) {
    clearTimeout(this.expirationTimeout);
  }
};

Observable.prototype.dispose = function() {
  this.state = 'disposed';
  this._clearTimeout();
  return this;
};

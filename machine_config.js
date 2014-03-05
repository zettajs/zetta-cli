var EventEmitter = require('events').EventEmitter;
var pubsub = require('./pubsub_service.js');

var MachineConfig = module.exports = function(machine) {
  this.machine = machine;
  this.transitions = {};
  this.allowed = {};
  this._devices = [];
  this.emitter = new EventEmitter();

  var self = this;

  this.machine.on = function(type, handler) {
    self.emitter.on(type, handler);
  }.bind(this.machine);

  this.machine.properties = {};
  var reserved = ['properties', 'allowed', 'transitions', '_devices'];

  this.machine.update = function() {
    var properties = {};
    var self = this;
    Object.keys(self).forEach(function(key) {
      if (reserved.indexOf(key) === -1 && typeof self[key] !== 'function') {
        properties[key] = self[key];
      }
    });

    this.properties = properties;
  }.bind(this.machine);

  // TODO: Namespace this as something weird so there's no accidental override.
  this.machine.transitions = this.transitions;
  this.machine.allowed = this.allowed;
  this.machine.call = this.call.bind(this);
  this.machine.emit = this.emitter.emit.bind(this.emitter);
  this.machine.devices = this.devices.bind(this);
  this.machine._devices = this._devices;
};

MachineConfig.prototype.stream = function(queueName, handler) {
  var emitter = new EventEmitter();

  queueName = this.machine.type + '/' + queueName;
  
  emitter.on('data', function(d) {
    pubsub.publish(queueName, d);
  });

  handler.call(this.machine, emitter);
};

MachineConfig.prototype.map = function(type, handler, fields) {
  this.transitions[type] = { handler: handler, fields: fields };
  return this;
};

MachineConfig.prototype.devices = function(subdevices) {
  this._devices = this._devices.concat(subdevices);
  this.machine._devices = this._devices;
  return this;
};

MachineConfig.prototype.when = function(state, options) {
  var allow = options.allow;
  if (!allow) {
    return this;
  }

  this.allowed[state] = allow;

  return this;
};

MachineConfig.prototype.call = function(/* type, ...args */) {
  var args = Array.prototype.slice.call(arguments);
  var type = args[0];
  var rest = args.slice(1);

  var self = this;
  var cb = function(err, val) {
    var properties = {};
    Object.keys(self.machine).forEach(function(key) {
      if (typeof self.machine[key] !== 'function' && ['transitions', 'allowed', 'properties'].indexOf(key) === -1) {
        properties[key] = self.machine[key];
      }
    });

    self.machine.properties = properties;

    var cbArgs = Array.prototype.slice.call(arguments);
    if (cbArgs.length && cbArgs[0] instanceof Error) {
      self.emitter.emit('error', cbArgs[0]);
    } else {
      cbArgs[0] = type;
      self.emitter.emit.apply(self.emitter, cbArgs);
    }
  };

  var handlerArgs = rest.concat([cb]);


  if (this.transitions[type]) {
    this.transitions[type].handler.apply(this.machine, handlerArgs);
  }
};

MachineConfig.create = function(machine) {
  return new MachineConfig(machine);
};

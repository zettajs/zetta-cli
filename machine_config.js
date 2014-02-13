var EventEmitter = require('events').EventEmitter;

var MachineConfig = module.exports = function() {
  this.transitions = {};
  this.emitter = new EventEmitter();
};

MachineConfig.prototype.map = function(type, handler, fields) {
  this.transitions[type] = { handler: handler, fields: fields };
  this.emitter.on(type, handler);
};

MachineConfig.create = function() {
  return new MachineConfig();
};

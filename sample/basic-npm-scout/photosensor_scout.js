var PhotosensorDriver = require('./photosensor_driver');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var PhotosensorScout = module.exports = function() {
  EventEmitter.call(this);
};
util.inherits(PhotosensorScout, EventEmitter);

PhotosensorScout.prototype.init = function(cb) {
  this.emit('discover', PhotosensorDriver);
};

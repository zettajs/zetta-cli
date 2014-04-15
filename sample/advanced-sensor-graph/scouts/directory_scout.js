var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var DirectoryScout = module.exports = function() {
  EventEmitter.call(this);
  this.directory = path.join(__dirname, '..', 'drivers');
  this.drivers = [];
};
util.inherits(DirectoryScout, EventEmitter);

DirectoryScout.prototype.init = function(next) {
  
  var id = 0;
  var AccelDriver = require('../drivers/accelerometer_driver');
  while(id < 3) {
    this.emit('discover', AccelDriver, id);
    id++;
  }
  
  var id = 0;
  var barometerdriver = require('../drivers/barometer_driver');
  while(id < 2) {
    this.emit('discover', barometerdriver, id);
    id++;
  }
  
  var id = 0;
  var humiditydriver = require('../drivers/humidity_driver');
  while(id < 1) {
    this.emit('discover', humiditydriver, id);
    id++;
  }
  var id = 0;
  var LedDriver = require('../drivers/led_driver');
  while(id < 3) {
    this.emit('discover', LedDriver, id);
    id++;
  }
  next();
};




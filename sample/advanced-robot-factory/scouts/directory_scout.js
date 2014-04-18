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
  var RobotDriver = require('../drivers/robot_driver');
  while(id < 1) {
    this.emit('discover', RobotDriver, id);
    id++;
  }
  
  var id = 0;
  var BarometerDriver = require('../drivers/barometer_driver');
  while(id < 1) {
    this.emit('discover', BarometerDriver, id);
    id++;
  }
 
  var id = 0;
  var HumidityDriver = require('../drivers/humidity_driver');
  while(id < 1) {
    this.emit('discover', HumidityDriver, id);
    id++;
  }

  var id = 0;
  var LcdDriver = require('../drivers/lcd_driver');
  while(id < 1) {
    this.emit('discover', LcdDriver, id);
    id++;
  }

  var id = 0;
  var PhotocellDriver = require('../drivers/photocell_driver');
  while(id < 2) {
    this.emit('discover', PhotocellDriver, id);
    id++;
  }
 
  var id = 0;
  var SoundDriver = require('../drivers/sound_driver');
  while(id < 1) {
    this.emit('discover', SoundDriver, id);
    id++;
  }

  var id = 0;
  var TemperatureDriver = require('../drivers/temperature_driver');
  while(id < 1) {
    this.emit('discover', TemperatureDriver, id);
    id++;
  }

  next();
};




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
  var self = this;
  fs.readdir(self.directory, function(err, files) {
    var drivers = files.filter(function(file) {
      if (/^.+\.js$/.test(file)) {
        return file;
      }
    }).forEach(function(file) {
      var p = path.join(self.directory, file);
      var device = require(path.join(self.directory, file));
      self.emit('discover', device);
    });  
  });
  next();
};




var EventEmitter = require('events').EventEmitter;
var mdns = require('mdns');
var util = require('util');
var YunDriver = require('../drivers/arduino_yun.js');

var MDNSScout = module.exports = function() {
 EventEmitter.call(this); 
};
util.inherits(MDNSScout, EventEmitter);

MDNSScout.prototype.init = function() {
  var self = this;
  var browser = mdns.createBrowser(mdns.tcp('arduino'));
  browser.on('serviceUp', function(service) {
    var ipAddr = service.addresses[0];
    self.emit('discover', YunDriver);
  });
  browser.start();
};

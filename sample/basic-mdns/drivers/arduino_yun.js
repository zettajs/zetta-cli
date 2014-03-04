var YunProtocol = require('../lib/yun_led_protocol');

var ArduinoYun = module.exports = function() {
  this.name = 'yun';
  this.state = 'on';
  this.ipAddr = '192.168.1.25';
  this.protocol = new YunProtocol(this.ipAddr);
};

ArduinoYun.prototype.init = function(config) {
  config
    .when('off', { allow: ['turn-on'] })
    .when('on', { allow: ['turn-off'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff);
};

ArduinoYun.prototype.turnOn = function(cb) {
  var self = this;
  this.protocol.on(function(err, res) {
    if(err) {
      console.log('err:', err);
      cb(err);
    } else {
      self.state = 'on';
      cb();
    }
  });
};

ArduinoYun.prototype.turnOff = function(cb) {
  var self = this;
  this.protocol.off(function(err, res) {
    if(err) {
      console.log('err:', err);
      cb(err);
    } else {
      self.state = 'off';
      cb();
    }
  });
};

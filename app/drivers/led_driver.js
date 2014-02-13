var LEDDriver = module.exports = function() {
  this.name = 'led';
  this.state = 'off';
};

LEDDriver.prototype.init = function(config) {
  config
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .map('toggle', this.toggle);
};

LEDDriver.prototype.turnOn = function(cb) {
  this.state = 'on';
  cb();
};

LEDDriver.prototype.turnOff = function(cb) {
  this.state = 'off';
  cb();
};

LEDDriver.prototype.toggle = function(cb) {
  if (this.state === 'off') {
    this.turnOn(cb);
  } else if (this.state === 'off') {
    this.turnOff(cb);
  } else {
    cb(new Error('Invalid state - Valid states are "on" and "off".'));
  }
};

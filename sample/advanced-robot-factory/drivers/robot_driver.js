var RobotArmDriver = module.exports = function(id) {
  this.type = 'arm';
  this.name = 'arm-'+id;
  this.data = {};
  this.id = id;
  this.state = 'standby';
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.led = false;
};

RobotArmDriver.prototype.init = function(config) {
  config
    .when('standby', { allow: ['left', 'right', 'up', 'down', 'toggle-light']})
    .when('left', { allow: [] })
    .when('right', { allow: []})
    .when('up', { allow: []})
    .when('down', { allow: []})
    .when('toggle-light', { allow: ['left', 'right', 'up', 'down']})
    .map('left', this.left, [{name:'degrees', type:'number'}])
    .map('right', this.right, [{name:'degrees', type:'number'}])
    .map('up', this.up, [{name:'degrees', type:'number'}])
    .map('down', this.down, [{name:'degrees', type:'number'}])
    .map('toggle-light', this.light)
    .stream('x-'+this.id, this.streamX)
    .stream('y-'+this.id, this.streamY)
    .stream('z-'+this.id, this.streamZ);
};

RobotArmDriver.prototype.streamX = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.x);
  }, 500);
};

RobotArmDriver.prototype.streamY = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.y);
  }, 500);
};

RobotArmDriver.prototype.streamZ = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.z);
  }, 500);
};

RobotArmDriver.prototype.left = function(degrees, cb) {
  this.state = 'left';
  var self = this;
  setTimeout(function() {
    self.x = degrees * -1;
    self.state = 'standby';
    cb();
  }, 1000);
};

RobotArmDriver.prototype.right = function(degrees, cb) {
  this.state = 'right';
  var self = this;
  setTimeout(function() {
    self.x = degrees;
    self.state = 'standby';
    cb();
  }, 1000);
};

RobotArmDriver.prototype.up = function(degrees, cb) {
  this.state = 'up';
  var self = this;
  setTimeout(function() {
    self.y = degrees;
    self.state = 'standby';
    cb();
  }, 1000);
};

RobotArmDriver.prototype.down = function(degrees, cb) {
  this.state = 'down';
  var self = this;
  setTimeout(function() {
    self.y = degrees * -1;
    self.state = 'standby';
    cb();
  }, 1000);
};

RobotArmDriver.prototype.light = function(cb) {
  this.led = !this.led;
};

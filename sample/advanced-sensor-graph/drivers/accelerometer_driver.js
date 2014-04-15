var AccelerometerDriver = module.exports = function(id) {
  this.type = 'accelerometer';
  this.name = 'multi-axis-accel-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.elevation = 0;
  this.battery = 0;
};

AccelerometerDriver.prototype.init = function(config) {
  config
    .stream('x-'+this.id, this.streamX)
    .stream('y-'+this.id, this.streamY)
    .stream('z-'+this.id, this.streamZ)
    .stream('elevation'+this.id, this.streamElevation)
    .stream('battery'+this.id, this.streamBattery);
};

AccelerometerDriver.prototype.streamX = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};

AccelerometerDriver.prototype.streamY = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};

AccelerometerDriver.prototype.streamZ = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};

AccelerometerDriver.prototype.streamElevation = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.floor(Math.random() * 100));
  }, 500);
};

AccelerometerDriver.prototype.streamBattery = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 1);
  }, 500);
};

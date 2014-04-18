var BarometerDriver = module.exports = function(id) {
  this.type = 'barometer';
  this.name = 'barometer-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

BarometerDriver.prototype.init = function(config) {
  config
    .stream('elevation-'+this.id, this.streamElevation)
    .stream('pressure-'+this.id, this.streamPressure);
};

BarometerDriver.prototype.streamPressure = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};

BarometerDriver.prototype.streamElevation = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};


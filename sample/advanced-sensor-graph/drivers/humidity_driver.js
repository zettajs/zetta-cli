var HumidityDriver = module.exports = function(id) {
  this.type = 'humidity';
  this.name = 'humidity-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

HumidityDriver.prototype.init = function(config) {
  config
    .stream('humidity-'+this.id, this.streamHumidity);
};

HumidityDriver.prototype.streamHumidity = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};


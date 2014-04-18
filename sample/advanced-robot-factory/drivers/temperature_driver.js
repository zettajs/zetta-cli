var TemperatureDriver = module.exports = function(id) {
  this.type = 'temperature';
  this.name = 'temperature-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

TemperatureDriver.prototype.init = function(config) {
  config
    .stream('temp-'+this.id, this.streamTemp);
};

TemperatureDriver.prototype.streamTemp = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 50);
};


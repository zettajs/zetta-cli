var PhotocellDriver = module.exports = function(id) {
  this.type = 'photocell';
  this.name = 'lumosity-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

PhotocellDriver.prototype.init = function(config) {
  config
    .stream('lumosity-'+this.id, this.streamlumosity);
};

PhotocellDriver.prototype.streamlumosity = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 500);
};


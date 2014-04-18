var SoundDriver = module.exports = function(id) {
  this.type = 'sound';
  this.name = 'sound-'+id;
  this.data = {};
  this.id = id;
  this.state = 'on';
};

SoundDriver.prototype.init = function(config) {
  config
    .stream('sound-'+this.id, this.streamSound);
};

SoundDriver.prototype.streamSound = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.random() * 100);
  }, 50);
};


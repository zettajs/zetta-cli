var PhotosensorDriver = module.exports = function() {
  this.type = 'photosensor';
  this.name = 'joes-office-photosensor';
  this.data = {};
  this.state = 'on';
  this.value = 0;
};

PhotosensorDriver.prototype.init = function(config) {
  for (var i = 1; i <= 12; i++) {
    config.stream('value' + i, this.onValue);
  };
};

PhotosensorDriver.prototype.onValue = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.floor(Math.random() * 100));
  }, 32);
};

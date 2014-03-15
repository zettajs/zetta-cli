var PhotosensorDriver = module.exports = function(name) {
  this.type = 'photosensor';
  this.name = name;//'joes-office-photosensor';
  this.data = {};
  this.state = 'on';
  this.value = 0;
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .stream('value', this.onValue);
};

PhotosensorDriver.prototype.onValue = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.floor(Math.random() * 100));
  }, 2000);

  /*this.board.on('digitalChange', function(e) {
    emitter.emit('data', e.value);
  });*/
};

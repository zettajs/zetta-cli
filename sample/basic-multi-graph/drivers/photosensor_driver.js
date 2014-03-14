var PhotosensorDriver = module.exports = function() {
  this.type = 'photosensor';
  this.name = 'joes-office-photosensor';
  this.data = {};
  this.state = 'on';
  this.value = 0;
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .stream('value1', this.onValue)
    .stream('value2', this.onValue)
    .stream('value3', this.onValue)
    .stream('value4', this.onValue)
    .stream('value5', this.onValue);
};

PhotosensorDriver.prototype.onValue = function(emitter) {
  setInterval(function() {
    emitter.emit('data', Math.floor(Math.random() * 100));
  }, 2000);

  /*this.board.on('digitalChange', function(e) {
    emitter.emit('data', e.value);
  });*/
};

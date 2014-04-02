var rx = require('rx');

var PhotosensorDriver = module.exports = function() {
  this.type = 'photosensor';
  this.name = 'joes-office-photosensor';
  this.data = {};
  this.state = 'on';
  this.value = 0;
  this.valueSubject = new rx.BehaviorSubject(this.value);
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .map('change', function(value) { this.value = value; })
    .stream('value', this.onValue);
};

PhotosensorDriver.prototype.onValue = function(emitter) {
  var self = this;
  setInterval(function() {
    self.value = Math.floor(Math.random() * 100);
    self.valueSubject.onNext(self.value);
    emitter.emit('data', self.value);
  }, 2000);

  /*this.board.on('digitalChange', function(e) {
    emitter.emit('data', e.value);
  });*/
};

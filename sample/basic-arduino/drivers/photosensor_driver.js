var ArduinoFirmata = require('arduino-firmata');

var board = null;

var PhotosensorDriver = module.exports = function() {
  this.type = 'photosensor';
  this.name = 'joes-office-photosensor';
  this.data = {};
  this.state = 'on';
  this.value = 0;
  board = new ArduinoFirmata();
  board.connect('/dev/tty.usbmodem1451');
  this.connected = false;
  var self = this;
  board.on('connect',function(){
    console.log('board connceted');
    self.connected = true;
  });
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .stream('value', this.onValue);
};

PhotosensorDriver.prototype.onValue = function(emitter) {
  var self = this;
  setInterval(function(){
    if(!self.connected)
      return;

    var val = board.analogRead(0);
    emitter.emit('data', val);
    self.value = val;
  },200);

  /*this.board.on('digitalChange', function(e) {
    emitter.emit('data', e.value);
  });*/
};

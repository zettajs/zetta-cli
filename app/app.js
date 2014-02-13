var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(fog) {
  var photosensor = fog.provision('photosensor');
  var led = fog.provision('led');

  led.on('turn-on', function() {
    console.log('turning on led');
  });

  led.on('turn-off', function() {
    console.log('turning off led');
  });

  photosensor.on('change', function(value) {
    if (value < 100) {
      led.call('turn-on');
    } else {
      led.call('turn-off');
    }
  });

  fog.expose('/photosensor', photosensor);
};

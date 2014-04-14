var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.observe('type="led"')
    .zip(zetta.observe('type="photosensor"'))
    .first()
    .subscribe(function(devices) {
      var led = devices[0];
      var photosensor = devices[1];

      photosensor.on('change', function(value) {
        if (value < 100) {
          led.call('turn-on');
        } else {
          led.call('turn-off');
        }
      });

      zetta.expose(led);
      zetta.expose(photosensor);
    });
};

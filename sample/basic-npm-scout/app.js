var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.get('joes-office-photosensor', function(err, photosensor) {
    zetta.get('joes-office-led', function(err, led) {
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
  });
};

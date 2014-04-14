var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.get('joes-office-photosensor', function(err, photosensor) {
    zetta.get('joes-office-led', function(err, led) {
      led.on('turn-on', function() {
        console.log('turning on');
      });

      led.on('turn-off', function() {
        console.log('turning off');
      });

      photosensor.on('change', function(value) {
        if (value < 100) {
          led.call('turn-on');
        } else {
          led.call('turn-off');
        }
      });

      led.on('error', function(err) {
        if (typeof err !== app.TransitionError) {
          throw err;
        }
      });

      zetta.expose(led);
      zetta.expose(photosensor);
    });
  });
};


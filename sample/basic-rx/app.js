var rx = require('rx');

var BasicRxApp = module.exports = function() {
  this.name = 'basic-rx';
};

BasicRxApp.prototype.init = function(elroy) {
  elroy.get('joes-office-photosensor', function(err, photosensor) {
    elroy.get('joes-office-led', function(err, led) {
      //photosensor.valueSubject.subscribe(function(value) {
      photosensor.on('change', function(value) {
        if (value < 30 && led.state === 'off') {
          led.call('turn-on');
        } else if (value >= 30 && led.state === 'on') {
          led.call('turn-off');
        }
      });

      elroy.expose(led);
      elroy.expose(photosensor);
    });
  });

  /*elroy.get('joes-office-photosensor')
    .zip(elroy.get('joes-office-led'))
    .subscribe(function(devices) {
      var photosensor = devices[0];
      var led = devices[1];

      photosensor.on('change', function(value) {
        if (value < 100) {
          led.call('turn-on');
        } else {
          led.call('turn-off');
        }
      });

      elroy.expose(led);
      elroy.expose(photosensor);
    });*/
};

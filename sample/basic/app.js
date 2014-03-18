var Scientist = require('../../scientist');
var Nightlight = require('./nightlight');

var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  /*elroy.get('joes-office-photosensor', function(err, photosensor) {
    elroy.get('joes-office-led', function(err, led) {
      photosensor.on('change', function(value) {
        if (value < 100) {
          led.call('turn-on');
        } else {
          led.call('turn-off');
        }
      });

      elroy.expose(led);
      elroy.expose(photosensor);
    });
  });*/

  elroy.get('joes-office-photosensor')
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
    });
};

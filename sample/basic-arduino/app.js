var Scientist = require('../../scientist');
var Nightlight = require('./nightlight');

var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.get('joes-office-photosensor', function(err, photosensor) {
    zetta.get('joes-office-led', function(err, led) {
      var nightlight = Scientist.configure(Nightlight, photosensor, led);

      zetta.expose(nightlight);
      zetta.expose(nightlight.leds[0], '/nightlight/led')
    });
  });
};


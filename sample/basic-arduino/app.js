var Scientist = require('../../scientist');
var Nightlight = require('./nightlight');

var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.get('joes-office-photosensor', function(err, photosensor) {
    elroy.get('joes-office-led', function(err, led) {
      var nightlight = Scientist.configure(Nightlight, photosensor, led);

      elroy.expose(nightlight);
      elroy.expose(nightlight.leds[0], '/nightlight/led')
    });
  });
};


var Nightlight = module.exports = function(photosensor, led) {
  this.name = 'nightlight';
  this.photosensors = [photosensor];
  this.leds = [led];
  this.state = 'off';
};

Nightlight.prototype.init = function(config) {
  config
    .when('off', { allow: ['turn-on'] })
    .when('on', { allow: ['turn-off'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .devices(this.photosensors)
    .devices(this.leds);
  
    var led = this.leds[0];
    var photosensor = this.photosensors[0];

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
};

Nightlight.prototype.turnOn = function(cb) {
  var self = this;
  this.leds[0].call('turn-on', function(err) {
    if (!err) {
      self.state = 'on';
    }

    if (cb) cb();
  });
};

Nightlight.prototype.turnOff = function(cb) {
  var self = this;

  this.leds[0].call('turn-off', function(err) {
    if (!err) {
      self.state = 'off';
    }

    if (cb) cb();
  });
};

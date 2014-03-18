var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.observe('type="led"')
    .zip(elroy.observe('type="photosensor"'), function(led, photosensor) {
      return [led, photosensor];
    })
    .first()
    .timeout(3000)
    .catch(function(err) {
      elroy.log(err);
      process.exit();
    })
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

      elroy.expose(led);
      elroy.expose(photosensor);
    });

  /*elroy.observe('type="led"')
    .takeWhile(function(led, cb) {
      cb(parseInt(led.name[3]) <= 5);
    })
    .subscribe(function(err, led) {
      elroy.expose(led);
    });*/

  /*elroy.observe('type="led"')
    .takeUntil(function(led, cb) {
      cb(parseInt(led.name[3]) > 5);
    })
    .subscribe(function(err, led) {
      elroy.expose(led);
    });*/
};

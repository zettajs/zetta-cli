var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.observe('type="led"')
    .zip(elroy.observe('type="photosensor"'))
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
    .takeWhile(function(led) {
      return parseInt(led.name[3]) <= 5;
    })
    .subscribe(function(led) {
      elroy.expose(led);
    });*/
};

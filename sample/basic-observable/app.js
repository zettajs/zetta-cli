var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  /*elroy.observe('type="led"')
    .first()
    .subscribe(function(err, led) {
      elroy.expose(led);
    });*/

  elroy.observe('type="led"')
    .zip(elroy.observe('type="photosensor"'))
    .first()
    .timeout(3000)
    .subscribe(function(err, devices) {
      var led = devices[0];
      var photosensor = devices[1];

      elroy.expose(led);
      elroy.expose(photosensor);
    })
    .catch(function(err) {
      elroy.log(err);
      process.exit();
    });
};

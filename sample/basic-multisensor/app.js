var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.observe('type="led"')
    .zip(elroy.observe('type="photosensor"'))
    .take(5)
    .subscribe(function(devices) {
      devices.forEach(function(d) {
        elroy.expose(d);
      });
    });
};

var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.observe('type="led"')
    .zip(zetta.observe('type="photosensor"'))
    .take(5)
    .subscribe(function(devices) {
      devices.forEach(function(d) {
        zetta.expose(d);
      });
    });
};

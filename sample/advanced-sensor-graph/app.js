
var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta
    .observe('type="accelerometer"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="led"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
};

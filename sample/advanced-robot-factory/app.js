
var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta
    .observe('type="arm"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

   zetta
    .observe('type="phone"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
  
  zetta
    .observe('type="lcd"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="barometer"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="humidity"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
  
  zetta
    .observe('type="sound"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="photocell"')
    .subscribe(function(d) {
      zetta.expose(d);
    });

  zetta
    .observe('type="temperature"')
    .subscribe(function(d) {
      zetta.expose(d);
    });
};

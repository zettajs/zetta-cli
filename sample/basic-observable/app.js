var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  var ledObservable = elroy.observe('type="led"');

  ledObservable.subscribe(function(err, led) {
    elroy.expose(led);
  });

  setTimeout(function() {
    ledObservable.dispose();
  }, 6 * 1000);
};


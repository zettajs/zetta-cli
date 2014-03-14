var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.observe('type="led"')
    .take(5)
    .subscribe(function(err, led) {
      elroy.expose(led);
    });
};


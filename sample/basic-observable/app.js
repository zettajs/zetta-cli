var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  elroy.observe('type="led"')
    .first()
    .subscribe(function(err, led) {
      elroy.expose(led);
    })
    .timeout(function() {
      elroy.log('Application timeout');
      process.exit();
    }, 3000)
};

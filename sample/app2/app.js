var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy, cb) {
  elroy.get('yun', function(err, yun) {
    yun.on('turn-on', function() {
      console.log('Turning PIN13 on.');
    });

    yun.on('turn-off', function() {
      console.log('Turning PIN13 off.');
    });
    elroy.expose(yun);
  });
};

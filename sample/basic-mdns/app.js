var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta, cb) {
  zetta.get('blinker', function(err, blinker) {
    blinker.call('turn-on');

    blinker.on('turn-on', function() {
      console.log('Turning PIN13 on.');
    });

    blinker.on('turn-off', function() {
      console.log('Turning PIN13 off.');
    });

    zetta.expose(blinker);
  });
};

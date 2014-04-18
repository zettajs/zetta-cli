var PhoneDriver = module.exports = function(id) {
  this.type = 'phone';
  this.name = 'phone-'+id;
  this.data = {};
  this.id = id;
  this.state = 'standby';
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.location = {
    latitude: 0.0,
    longitude: 0.0
  };
};

PhoneDriver.prototype.init = function(config) {
  config
    .when('standby', { allow: []})
    .stream('x-'+this.id, this.streamX)
    .stream('y-'+this.id, this.streamY)
    .stream('z-'+this.id, this.streamZ);
};

PhoneDriver.prototype.streamX = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.x);
  }, 500);
};

PhoneDriver.prototype.streamY = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.y);
  }, 500);
};

PhoneDriver.prototype.streamZ = function(emitter) {
  var self = this;
  setInterval(function() {
    emitter.emit('data', self.z);
  }, 500);
};


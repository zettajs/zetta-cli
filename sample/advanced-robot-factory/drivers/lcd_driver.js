var LcdDriver = module.exports = function(id){
  this.type = 'lcd';
  this.name = 'lcd-'+id;
  this.id = id;
  this.state = 'standby';
  this.written = 'Default message!';
}

LcdDriver.prototype.init = function(config) {
  config
    .when('standby', { allow: [ 'write' ] })
    .when('write', { allow: [] })
    .map('write', this.write, [{ name:'message', type:'text'}]);
};

LcdDriver.prototype.write = function(message, cb) {
  this.state = 'write';
  var self = this;
  setTimeout(function() {
    this.written = message;
    self.state = 'standby';
    cb();
  }, 1000);
};

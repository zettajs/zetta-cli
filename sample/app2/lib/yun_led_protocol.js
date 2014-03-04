var request = require('request');

var YunProtocol = module.exports = function(ip) {
  this.ip = 'http://'+ip;
  this.onEndpoint = '/arduino/on';
  this.offEndpoint = '/arduino/off';
};

YunProtocol.prototype.on = function(cb) {
  var endpoint = this.ip + this.onEndpoint;
  request(endpoint, function(err, res, body) {
    if (err) {
      cb(err);
    } else {
      cb(null, true);
    }
  });
};

YunProtocol.prototype.off = function(cb) {
  var endpoint = this.ip + this.offEndpoint;
  request(endpoint, function(err, res, body) {
    if (err) {
      cb(err);
    } else {
      cb(null, true);
    }
  });
};

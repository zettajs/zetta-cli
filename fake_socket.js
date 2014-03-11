var Duplex = require('stream').Duplex;
var util = require('util');
var BufferSource = require('./buffer_source');

var FakeSocket = module.exports = function(initial) {
  Duplex.call(this);

  this.source = new BufferSource();

  var self = this;
  this.source.onread = function(chunk) {
    console.log('fake socket pushing chunk');
    if (!self.push(chunk)) {
      console.log('stopping read');
      self.source.readStop();
    }
  };

  this.source.ending = function() {
    self.push(null);
  };

  this.onwrite = null;

  this.on('end', function() {
    console.log('ending'.toUpperCase());
    this.ending();
  });
};
util.inherits(FakeSocket, Duplex);

['setTimeout', 'destroy', 'destroySoon'].forEach(function(fn) {
  FakeSocket.prototype[fn] = new Function();
});

FakeSocket.prototype._write = function(chunk, encoding, cb) {
  console.log('FAKESOCKET _WRITE!!!!!');
  this.onwrite(chunk);
  cb();
};

FakeSocket.prototype._read = function(size) {
  return this.source.readStart(size);
};

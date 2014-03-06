var Duplex = require('stream').Duplex;
var util = require('util');
var BufferSource = require('./buffer_source');

var FakeSocket = module.exports = function(initial) {
  Duplex.call(this);

  this.source = new BufferSource();
  this.source.name = 'source';
  this.dest = new BufferSource();
  this.dest.name = 'dest';

  var self = this;
  this.source.onread = function(chunk) {
    if (!self.push(chunk)) {
      self.source.readStop();
    }
  };

  this.source.ending = function() {
    self.push(null);
  };

  var self = this;
  this.onread = function() {
    //console.log('fake socket readable');
    var data;
    while (data = self.read()) {
      //console.log('data:', data);
      this.ondata(data, 0, data.length);
    }
  };

  this.onwrite = null;

  this.on('end', function() {
    this.ending();
  });
};
util.inherits(FakeSocket, Duplex);

['setTimeout', 'destroy', 'destroySoon'].forEach(function(fn) {
  FakeSocket.prototype[fn] = new Function();
});

FakeSocket.prototype._write = function(chunk, encoding, cb) {
  //console.log('fake socket _write:', chunk);
  this.onwrite(chunk);
  this.dest.write(chunk);
  cb();
};

FakeSocket.prototype._read = function(size) {
  //console.log('fake socket _read:', size);
  return this.source.readStart(size);
};

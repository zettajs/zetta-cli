

var Duplex = require('stream').Duplex;
var util = require('util');

var FakeSocket = module.exports = function() {
  Duplex.call(this);

  this.source = new BufferSource();

  this.on('finish', function() {
    this.source.state = 'ready';
  });

  var self = this;
  this.source.ondata = function(chunk) {
    if (!self.push(chunk)) {
      self.source.readStop();
    }
  };

  this.source.onend = function() {
    self.push(null);
  };
};
util.inherits(FakeSocket, Duplex);

FakeSocket.prototype.setTimeout = function() { };
FakeSocket.prototype.destroy = function() { };

FakeSocket.prototype._write = function(chunk, encoding, cb) {
  this.source.write(chunk);
  cb();
};

FakeSocket.prototype._read = function(size) {
  return this.source.readStart();
};

var BufferSource = function() {
  this.state = 'initialized'; // 'ready', 'stopped'
  this.buffer = [];
  this.ondata = null;
  this.onend = null;

  var self = this;
};

BufferSource.prototype.readStart = function() {
  var self = this;
  var id = setInterval(function() {
    if (self.state === 'stopped') {
      clearInterval(id);
      return;
    }

    if (self.state !== 'initialized') {
      if (self.buffer.length === 0) {
        self.state = 'stopped'
        self.onend();
      } else {
        self.ondata(self.buffer.shift());
      }
    }
  }, 1);
};

BufferSource.prototype.readStop = function() {
  this.state = 'paused';
};

BufferSource.prototype.write = function(chunk) {
  this.buffer.push(chunk);
};

var BufferSource = module.exports = function() {
  this.state = 'initialized'; // 'ready', 'inprogress', 'paused', 'stopped'
  this.buffer = [];
  this.ondata = null;
  this.onend = null;
  this.name = null;
};

BufferSource.prototype.readStart = function(size) {
  this.state = 'ready';
  var self = this;

  if (self.buffer.length === 0) {
    self.state = 'inprogress'
  } else {
    self.onread(self.buffer.shift());
  }
};

BufferSource.prototype.readStop = function() {
  this.state = 'paused';
};

BufferSource.prototype.write = function(chunk) {
  this.buffer.push(chunk);

  if (this.state === 'inprogress') {
    this.onread(this.buffer.shift());
  }
};

var BufferSource = module.exports = function() {
  this.state = 'initialized'; // 'ready', 'inprogress', 'paused'
  this.buffer = [];
  this.onread = null;
};

BufferSource.prototype.readStart = function(size) {
  console.log('readstart');
  //this.state = 'ready';
  this.state = 'inprogress'

  var self = this;
  if (self.buffer.length > 0) {
    self._read();
  }
};

BufferSource.prototype.readStop = function() {
  this.state = 'paused';
};

BufferSource.prototype._read = function() {
  while(this.buffer.length) {
    console.log('onread called');
    this.onread(this.buffer.shift());
  }
};

BufferSource.prototype.write = function(chunk) {
  this.buffer.push(chunk);

  console.log('buffer:', this.buffer);

  if (this.state === 'inprogress') {
    this._read();
  }
};

var BufferSource = module.exports = function() {
  this.state = 'initialized'; // 'ready', 'stopped'
  this.buffer = [];
  this.ondata = null;
  this.onend = null;
  this.name = null;
};

BufferSource.prototype.readStart = function(size) {
  //console.log(this.name, 'readStart');
  this.state = 'ready';
  var self = this;

  if (self.buffer.length === 0) {
    self.state = 'inprogress'
    //self.state = 'stopped'
    //self.onend();
  } else {
    self.onread(self.buffer.shift());
  }
};

BufferSource.prototype.readStop = function() {
  //console.log(this.name, 'readStop');
  this.state = 'paused';
};

BufferSource.prototype.write = function(chunk) {
  //console.log(this.name, 'write');
  this.buffer.push(chunk);

  if (this.state === 'inprogress') {
    this.onread(this.buffer.shift());
  }
};

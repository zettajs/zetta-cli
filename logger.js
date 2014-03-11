var EventEmitter = require('events').EventEmitter;
var util = require('util');
var colors = require('colors');
var bunyan = require('bunyan');
var Stream = require('stream');

function Logger() {
  EventEmitter.call(this);
  var stream = new Stream();
  stream.writable = true;

  stream.write = function(obj) {
    var msg =  obj.time.getTime().toString().green + ' ' + obj.msg.blue;
    console.log(msg);
  };
  this.bunyanInstance = bunyan.createLogger({ name: 'elroy', streams:[{type: 'raw', stream:stream}] });
}
util.inherits(Logger, EventEmitter);

/*
 * Logger intercepts messages sent from all over the fog runtime. We format them accordingly.
 *
 */
Logger.prototype.init = function() {
  var self = this;
  this.on('log', function(event, message) {
    var msg = '['+event+'] ' + message;
    self.bunyanInstance.info(msg);
    //console.log(msg);
  });
  
  this.on('user-log', function(msg, data) {
    self.bunyanInstance.info(data, '[user-log] '+msg);
  });
};

var logger = null;

module.exports = function() {
  if(logger) {
    return logger;
  } else {
    logger = new Logger();
    logger.init();
    return logger;
  }
};


var EventEmitter = require('events').EventEmitter;
var util = require('util');
var colors = require('colors');

function Logger() {
  EventEmitter.call(this);
}
util.inherits(Logger, EventEmitter);

/*
 * Logger intercepts messages sent from all over the fog runtime. We format them accordingly.
 *
 */
Logger.prototype.init = function() {
  this.on('log', function(event, message) {
    var msg = '['+event+'] ' + message.underline.blue;
    console.log(msg);
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


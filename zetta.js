var Logger = require('./logger')();
var Scientist = require('./scientist');

var Elroy = {}; 

Elroy.log = function(msg, data) {
  Logger.emit('user-log', msg, data);
};

Elroy.configure = function(/* args */) {
  return Scientist.configure.apply(null,arguments);
};

module.exports = Elroy;

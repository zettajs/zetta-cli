var Logger = require('./logger');
var l = Logger();

var subscribedTo = [];
var response;
 
exports.publish = function(name, data) {
  if(subscribedTo.indexOf(name) !== -1) {
    if(response) {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      } else {
        data = data.toString();
      }

      var stream = response.push(name, { 'Host': 'fog.argo.cx' });

      stream.end(new Buffer(data));
    } else {
      console.error('no response object');
    }
  }
};

exports.subscribe = function(res, name) {
  response = res;
  if (subscribedTo.indexOf(name) === -1) {
    l.emit('log', 'fog-runtime', 'Created subscription to stream '+name);
    subscribedTo.push(name);
  }
};
 
exports.unsubscribe = function(name) {
  var i = subscribedTo.indexOf(name);
  subscribedTo.splice(i);
};

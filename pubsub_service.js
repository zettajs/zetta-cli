var subscribedTo = [];
var socket;
 
exports.setSocket = function(s) {
  socket = s;
};
 
exports.subscribe = function(name) {
  if (subscribedTo.indexOf(name) === -1) {
    subscribedTo.push(name);
  }
};
 
exports.unsubscribe = function(name) {
  var i = subscribedTo.indexOf(name);
  subscribedTo.splice(i);
};

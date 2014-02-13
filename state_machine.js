var StateMachine = module.exports = function() {
  this.state = null;
  this.handlers = {};
  this.transitions = {};
};

StateMachine.prototype.init = function(state) {
  this.state = state;
};

StateMachine.prototype.on = function(command, handler) {
  this.handlers[command] = handler;
}

StateMachine.prototype.map = function(command, state) {
  this.transitions[command] = state;
};

StateMachine.prototype.call = function(command) {
  if (this.transitions[command]) {
    this.state = this.transitions[command];
  }

  if (this.handlers[command]) {
    this.handlers[command]();
  }
};

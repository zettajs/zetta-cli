var Logger = require('./logger');

var Observable = module.exports = function(query, runtime) {
  this.query = query;
  this.runtime = runtime;
  this.registry = this.runtime.registry;
  this.logger = new Logger();
  this.state = 'ready'; // disposed
  this.remainder = null;
  this.takePredicate = null;
  this.expirationTimeout = null;
  this.zipped = [];
  this.zipReturned = {};
  this.current = [];
};

Observable.prototype._checkZipped = function(cb) {
  var self = this;
  var keys = Object.keys(self.zipReturned);

  if (keys.length === self.zipped.length && self.current.length) {
    var ready = true;

    keys.forEach(function(key) {
      if (!self.zipReturned[key].length) {
        ready = false;
      }
    });

    if (!ready) {
      return;
    }

    var ret = [];
    keys.forEach(function(key) {
      ret.push(self.zipReturned[key].shift());
    });

    ret.push(self.current.shift());

    cb(null, ret);
  }
};

Observable.prototype.subscribe = function(cb) {
  var self = this;

  if (this.zipped.length) {
    this.zipped.forEach(function(observable, i) {
      observable.subscribe(function(err, item) {
        if (!self.zipReturned[i]) {
          self.zipReturned[i] = [];
        }

        self.zipReturned[i].push(item);

        self._checkZipped(cb);
      });
    });
  }

  // TODO: Make this use a real query language.
  var pair = this.query.split('=');
  var key = pair[0];
  var value = JSON.parse(pair[1]);

  var devices = this.registry.devices
    .filter(function(device) {
      return device[key] === value;
    })
    .forEach(function(device) {
      setImmediate(function() { cb(null, device); });
    });

  var getDevice = function(device){
    if (self.state === 'disposed') {
      self.runtime.removeListener('deviceready', getDevice);
      return;
    }

    if(device[key] === value) {
      self._clearTimeout();

      var sendResult = function() {
        self.logger.emit('log', 'fog-runtime', 'Device retrieved '+device.name);

        if (self.zipped.length) {
          self.current.push(device);
          self._checkZipped(cb);
        } else {
          cb(null, device);
        }
      };

      if (self.takePredicate !== null) {
        var predicateCallback = function(shouldContinue) {
          if (shouldContinue) {
            sendResult();
            return;
          }

          self.dispose();
        };

        self.takePredicate.call(null, device, predicateCallback);
      } else if (self.remainder !== null) {
        self.remainder--;
        if (self.remainder === 0) {
          self.dispose();
        }
        sendResult();
      } else {
        sendResult();
      }

    }
  }

  this.runtime.on('deviceready', getDevice);

  return this;
};

Observable.prototype.take = function(limit) {
  this.remainder = limit;
  return this;
};

Observable.prototype.takeWhile = function(predicate) {
  this.takePredicate = predicate;
  return this;
};

Observable.prototype.takeUntil = function(predicate) {
  this.takePredicate = function(device, cb) {
    var negated = function(shouldContinue) {
      cb(!shouldContinue);
    };

    return predicate.call(null, device, negated);
  };

  return this;
};

Observable.prototype.first = function() {
  return this.take(1);
};

Observable.prototype.zip = function(observable) {
  this.zipped.push(observable);
  return this;
};

Observable.prototype.timeout = function(ms) {
  var self = this;
  this.expirationTimeout = setTimeout(function() {
    if (self.errorHandler) {
      self.errorHandler.call(null, new Error('Application timeout'));
    }

    self.dispose();
  }, ms);
  return this;
};

Observable.prototype.catch = function(errorHandler) {
  this.errorHandler = errorHandler;
};

Observable.prototype._clearTimeout = function() {
  if (this.expirationTimeout) {
    clearTimeout(this.expirationTimeout);
  }
};

Observable.prototype._throw = function(err) {
  if (this.errorHandler) {
    this.errorHandler.call(null, err);
  } else {
    throw err;
  }
};

Observable.prototype.dispose = function() {
  this.state = 'disposed';
  this._clearTimeout();
  this.zipped.forEach(function(observable) {
    observable.dispose();
  });
  return this;
};

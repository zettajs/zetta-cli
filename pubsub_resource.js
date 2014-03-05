var qs = require('querystring');
var pubsub = require('./pubsub_service');

var Subscription = module.exports = function() {
  this.path = '/_subscriptions';
};

Subscription.prototype.init = function(config) {
  config
    .path(this.path)
    .consumes('application/x-www-form-urlencoded')
    .produces('application/vnd.siren+json')
    .post('/', this.subscribe);
};


Subscription.prototype.subscribe = function(env, next) {
  var self = this;
  env.request.getBody(function(err, body) {
    if(err) {
      console.log(err);
      env.response.statusCode = 400;
      next(env);
    } else {
      body = qs.parse(body.toString());
      pubsub.subscribe(body.name); 
      //next(env);
    }
  });
};




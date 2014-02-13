var querystring = require('querystring');

var FogAppLoader = module.exports = function(server) {
  this.server = server;
  this.machines = [];
  this.app = null;
  this.path = null;
  this.exposed = {};
};

FogAppLoader.prototype.load = function(app) {
  this.app = app;
  this.path = '/' + (this.app.name || '');

  app.init(this);

  var resources = this.buildExposedResources();

  this.server.loadApp({ path: this.path, resources: resources });
};

FogAppLoader.prototype.provision = function(id) {
  var device = this.server.findDevice(id);
  this.machines.push(device);
};

FogAppLoader.prototype.expose = function(path, machine) {
  this.exposed[path] = machine;
};

FogAppLoader.prototype.buildExposedResources = function() {
  var resources = [];

  var self = this;
  Object.keys(this.exposed).forEach(function(path) {
    var machine = self.exposed[path];
    var resource = function() {
      this.actions = [];

      var self = this;
      Object.keys(machine.transitions).forEach(function(type) {
        var transition = machine.transitions[type];
        var fields = transition.fields || [];
        fields.push({ name: 'action', type: 'hidden', value: type });

        var action = {
          name: type,
          method: 'POST',
          href: env.helpers.url.current(),
          fields: fields
        };

        self.actions.push(action);
      });
    }

    resource.prototype.init = function(config) {
      config
        .path(path)
        .produces('application/vnd.siren+json')
        .consumes('application/x-www-form-urlencoded');
        .get('/', this.show)
        .post('/', this.action);
    };

    resource.prototype.show = function(env, next) {
      var entity = {
        properties: machine.properties,
        actions: this.actions,
        links: [{ rel: ['self'], href: env.helpers.url.current() }]
      };

      env.response.body = entity;
      next(env);
    };

    resource.prototype.action = function(env, next) {
      var self = this;
      env.request.getBody(function(err, body) {
        body = querystring.parse(body.toString());

        if (!body.action) {
          env.response.statusCode = 400;
          return next(env);
        }

        var action = this.actions.filter(function(action) {
          return (action.name === body.action);
        });

        if (!action) {
          env.response.statusCode = 400;
          return next(env);
        }

        var args = [action.name];

        action.fields.forEach(function(field) {
          args.push(body[field.name]);
        });

        machine.emit.apply(machine, args);

        var entity = {
          properties: machine.properties,
          actions: this.actions,
          links: [{ rel: ['self'], href: env.helpers.url.current() }]
        };

        env.response.body = entity;
        next(env);
      });
    };

    resources.push(resource);
  });

  return resources;
};

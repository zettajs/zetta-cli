var querystring = require('querystring');
var Scientist = require('./scientist');

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

  this.server.loadApp(resources);
};

FogAppLoader.prototype.provision = function(id) {
  var device = this.server.findDevice(id);
  this.machines.push(device);
  return device;
};

FogAppLoader.prototype.expose = function(path, machine) {
  if (typeof machine === 'function') {
    machine = Scientist.configure(machine);
  }

  this.exposed[this.path + path] = machine;
};

FogAppLoader.prototype.buildExposedResources = function() {
  var resources = [];
  var self = this;
  var rootPath = self.path;

  Object.keys(this.exposed).forEach(function(path) {
    var machine = self.exposed[path];
    var Resource = function() {
      this.actions = [];

      var self = this;
      Object.keys(machine.transitions).forEach(function(type) {
        var transition = machine.transitions[type];
        var fields = transition.fields || [];
        fields.push({ name: 'action', type: 'hidden', value: type });

        var action = {
          name: type,
          method: 'POST',
          href: null,
          fields: fields
        };

        self.actions.push(action);
      });
    };

    Resource.prototype.init = function(config) {
      config
        .path(path)
        .produces('application/vnd.siren+json')
        .consumes('application/x-www-form-urlencoded')
        .get('/', this.show)
        .post('/', this.action);
    };

    Resource.prototype.show = function(env, next) {
      var entity = {
        properties: machine.properties,
        actions: this.actions,
        links: [{ rel: ['self'], href: env.helpers.url.current() },
                { rel: ['index'], href: env.helpers.url.path(rootPath) }]
      };

      entity.actions.forEach(function(action) {
        action.href = env.helpers.url.current();
      });

      entity.actions = entity.actions.filter(function(action) {
        var allowed = machine.allowed[machine.state];
        if (allowed && allowed.indexOf(action.name) > -1) {
          return action;
        }
      });

      env.response.body = entity;
      next(env);
    };

    Resource.prototype.action = function(env, next) {
      var self = this;
      env.request.getBody(function(err, body) {
        body = querystring.parse(body.toString());

        if (!body.action) {
          env.response.statusCode = 400;
          return next(env);
        }

        var action = self.actions.filter(function(action) {
          return (action.name === body.action);
        });

        if (!action || !action.length) {
          env.response.statusCode = 400;
          return next(env);
        }

        action = action[0];

        var args = [action.name];

        if (action.fields && action.fields.length) {
          action.fields.forEach(function(field) {
            if (field.name !== 'action') {
              args.push(body[field.name]);
            }
          });
        }

        machine.call.apply(machine, args);

        var entity = {
          properties: machine.properties,
          actions: self.actions,
          links: [{ rel: ['self'], href: env.helpers.url.current() },
                  { rel: ['index'], href: env.helpers.url.path(rootPath) }]
        };

        entity.actions.forEach(function(action) {
          action.href = env.helpers.url.current();
        });

        entity.actions = entity.actions.filter(function(action) {
          var allowed = machine.allowed[machine.state];
          if (allowed && allowed.indexOf(action.name) > -1) {
            return action;
          }
        });

        env.response.body = entity;
        next(env);
      });
    };

    resources.push(Resource);
  });

  var HomeResource = function() {
    this.path = self.path;
  };

  HomeResource.prototype.init = function(config) {
    config
      .path(this.path)
      .produces('application/vnd.siren+json')
      .get('/', this.show);
  };

  HomeResource.prototype.show = function(env, next) {
    var entity = {
      class: ['home'],
      entities: [],
      links: [ { rel: ['self'], href: env.helpers.url.path(this.path) } ]
    };

    Object.keys(self.exposed).forEach(function(path) {
      var machine = self.exposed[path];
      entity.entities.push({
        class: ['machine'],
        rel: ['http://rels.elroy.io/machine'],
        properties: machine.properties,
        links: [ { rel: ['self'], href: env.helpers.url.path(path) } ]
      })
    });

    env.response.body = entity;
    next(env);
  };

  resources.push(HomeResource);

  return resources;
};

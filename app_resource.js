var querystring = require('querystring');
var url = require('url');

exports.create = function(loader) {
  function buildActions(machine) {
    var actions = null;

    Object.keys(machine.transitions).forEach(function(type) {
      var transition = machine.transitions[type];
      var fields = transition.fields ? [].concat(transition.fields) : [];
      fields.push({ name: 'action', type: 'hidden', value: type });

      var action = {
        name: type,
        method: 'POST',
        href: null,
        fields: fields
      };

      if (!actions) {
        actions = [];
      }

      actions.push(action);
    });

    return actions;
  }

  var AppResource = function() {
    this.path = loader.path;
  };

  function buildEntity(env, machine, actions, selfPath) {
    selfPath = selfPath || env.helpers.url.current();

    var entity = {
      class: [machine.name],
      properties: machine.properties,
      entities: undefined,
      actions: actions,
      links: [{ rel: ['self'], href: selfPath },
              { rel: ['index'], href: env.helpers.url.path(loader.path) }]
    };

    if (machine._devices.length) {
      entity.entities = machine._devices.filter(function(device) {
        var path = env.helpers.url.join(device.name);

        if (loader.exposed[url.parse(path).path]) {
          return device;
        }
      }).map(function(device) {
        var path = env.helpers.url.join(device.name);
        return buildEntity(env, device, null, path)
      });
    }

    if (entity.actions) {
      entity.actions.forEach(function(action) {
        action.href = env.helpers.url.current();
      });

      entity.actions = entity.actions.filter(function(action) {
        var allowed = machine.allowed[machine.state];
        if (allowed && allowed.indexOf(action.name) > -1) {
          return action;
        }
      });
    }

    return entity;
  }

  AppResource.prototype.init = function(config) {
    config.path(this.path)
      .produces('application/vnd.siren+json')
      .consumes('application/x-www-form-urlencoded')
      .get('/', this.home)
      .get('/{splat: (.*)}', this.show)
      .post('/{splat: (.*)}', this.action)
  };

  AppResource.prototype.home = function(env, next) {
    var entity = {
      class: ['home'],
      entities: [],
      links: [ { rel: ['self'], href: env.helpers.url.path(this.path) } ]
    };

    Object.keys(loader.exposed).forEach(function(path) {
      var machine = loader.exposed[path];
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

  AppResource.prototype.show = function(env, next) {
    // match path
    // load machine
    // build representation
    // don't forget subdevices

    var machine = loader.exposed[this.path + '/' + env.route.params.splat];

    if (!machine) {
      // return 404
      env.response.statusCode = 404;
      return next(env);
    }

    var actions = buildActions(machine);

    env.response.body = buildEntity(env, machine, actions);
    next(env);
  };

  AppResource.prototype.action = function(env, next) {
    var machine = loader.exposed[this.path + '/' + env.route.params.splat];

    if (!machine) {
      env.response.statusCode = 404;
      return next(env);
    }

    var actions = buildActions(machine);

    env.request.getBody(function(err, body) {
      body = querystring.parse(body.toString());

      if (!body.action) {
        env.response.statusCode = 400;
        return next(env);
      }

      var action = actions.filter(function(action) {
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

      var entity = buildEntity(env, machine, actions);

      env.response.body = entity;
      next(env);
    });
  };

  return AppResource;
};

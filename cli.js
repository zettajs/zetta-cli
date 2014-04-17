#!/usr/bin/env node

var program = require('commander');
var pkg = require('./package.json');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var ZettaRuntime = require('zetta-runtime');
var bootstrapper = ZettaRuntime.bootstrapper;

program
  .version(pkg.version)
  .usage('[options]')
  .option('new')
  .option('run')
  .option('open')
  .option('cloud')
  .option('--host -h [host]')
  .option('--app -a [app]')
  .option('--port -p [port]', parseInt)
  .parse(process.argv);

if(program.new) {
  var p = path.join(process.cwd(), program.args[0]);
  var s = path.join(__dirname, './sample/basic');
  fs.mkdir(p, function(err) {
    if(err) {
      console.log('Error creating folder!');
    } else {
      var cp = spawn('cp', [ '-r', s+'/.', p ]);

      cp.stderr.on('data', function(d) {
        console.log('error:'+d);
      });

    }
  });
}

if(program.run) {
  var app = null;
  if(program.A) {
    app = program.A;
  }
  bootstrapper(app);
}


if(program.open) {
  var app = path.basename(process.cwd());
  var o = spawn('open', ['http://siren-api-browser.herokuapp.com/#/entity?url=http:%2F%2Flocalhost:3002%2Fhello']);
}

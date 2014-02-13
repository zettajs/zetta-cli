var fs = require('fs');
var path = require('path');

var directory = path.join(__dirname, '..', 'drivers');

exports.list = function(cb) {
  fs.readdir(directory, function(err, files) {
    var drivers = files.filter(function(file) {
      if (/^.+\.js$/.test(file)) {
        return file;
      }
    }).map(function(file) {
      return require(path.join(directory, file));
    });

    cb(null, drivers);
  });
};

var PhotosensorScout = require('./photosensor_scout');

module.exports = function(runtime) {
  runtime.scouts.push(PhotosensorScout);
};

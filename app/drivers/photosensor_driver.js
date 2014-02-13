var PhotosensorDriver = module.exports = function() {
  this.name = 'photosensor';
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .map('change', this.change, [{ name: 'value', type: 'number' }]);
};

PhotosensorDriver.prototype.change = function(value, cb) {
  cb(null, value);
};

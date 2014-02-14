var PhotosensorDriver = module.exports = function() {
  this.name = 'photosensor';
  this.state = 'on';
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .when('on', { allow: ['change'] })
    .map('change', this.change, [{ name: 'value', type: 'number' }]);
};

PhotosensorDriver.prototype.change = function(value, cb) {
  cb(null, value);
};

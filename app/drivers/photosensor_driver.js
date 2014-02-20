var PhotosensorDriver = module.exports = function() {
  this.name = 'photosensor';
  this.state = 'on';
  this.value = 0;
};

PhotosensorDriver.prototype.init = function(config) {
  config
    .when('on', { allow: ['change'] })
    .map('change', this.change, [{ name: 'value', type: 'number' }]);
};

PhotosensorDriver.prototype.change = function(value, cb) {
  this.value = value;
  cb(null, value);
};

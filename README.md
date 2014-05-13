# ![Zetta.js](http://i.imgur.com/09p3qw1.png) 

Zetta is an open source platform for the Internet of Things.

* Model physical devices as state machines.
* Orchestrate interactions.
* Get an API... for free.

## Example

### app.js

```javascript
var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(zetta) {
  zetta.get('joes-office-photosensor', function(err, photosensor) {
    zetta.get('joes-office-led', function(err, led) {
      photosensor.on('change', function(value) {
        if (value < 100) {
          led.call('turn-on');
        } else {
          led.call('turn-off');
        }
      });

      zetta.expose(led);
      zetta.expose(photosensor);
    });
  });
};
```

## Install

```
$ npm install -g zetta
```



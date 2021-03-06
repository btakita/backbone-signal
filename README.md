backbone-signal
===============

A rich Signal & Slots (Reactive Programming) api on Backbone Models. It is composable, allows you to encapsulate loader logic,
 and have fine grained control over listening to change events.

# Usage

```javascript
// backbone-signal extends Backbone.Model
var app = new Backbone.Model();

// The block is called with load when the value of the signal is null.
var userSignal = app.signal("user").setLoader(function() {
  userSignal.set({
    name: "..."
  });
});

console.info("Let's see some friends");

// userSignal.value() is null so the loader is called
userSignal.load().getTruthy(app, function(app, user) {
  console.info("Hello " + user.name);
});

userSignal.set({
  name: "Jane"
});

// userSignal.value() is not null so the loader is not called
userSignal.load().getTruthy(app, function(app, user) {
  console.info("Nice to see you");
});

userSignal.set({
  name: "Joe"
});

userSignal.unset();
```

The console ouput is:

    Let's see some friends
    Hello ...
    Hello Jane
    Nice to see you
    Hello Joe
    Nice to see you

First, notice setLoader. The loader is called when load() if first called because userSignal.value() == null (== undefined as well). The second time load() is called, the loader is not called, since userSignal.value() is not == null.

We are calling getTruthy on the userSignal two times, one for "Hello " + user.name and one for "Nice to see you". The callback is invoked when the value is [Truthy](http://www.sitepoint.com/javascript-truthy-falsy/). So when userSignal.unset is called, the callbacks are not invoked.

What is nice about having a dedicated signal object is that you can bind to it even when it's value is undefined, thereby avoiding order dependencies and simplyfying your logic.

backbone-signal also utilizes Backbone's listenTo and listenToOnce methods, which make it easy to clean up by calling stopListening on the listener.

backbone-signal is being used in [www.rundavoo.com](http://www.rundavoo.com) and has been fun to use, especially with [node.js](http://nodejs.org/) & [Browserify](http://browserify.org/). It's been a pleasure using a lightweight unframework to freely structure the dataflow logic of the site.

#API

## Loading/Unloading

* load - Invokes the loader when the value is not defined
* forceLoad - Invokes the loader (regardless if the value is defined)
* reload - Unsets the value then invokes the loader
* unload - Invokes the unloader
* setLoader - Sets the Loader callback
* unsetLoader - Unsets the Loader callback
* setUnloader - Sets the Unloader callback
* unsetUnloader - Unsets the Unloader callback

## Setters

* set - Sets the value with the argument
* unset - Unsets the value
* value - Returns the value

## Getters/Listeners

* get - Invoke the callback immediately and on any additional changes to the value
* listen - Listen to any additional changes to the value (does not invoke the callback immediately)
* getOnce - Invoke the callback immediately one time
* listenOnce - Listen to any additional changes to the value one time
* getTruthy - Invoke the callback immediately and on any additional changes to the value if the value is truthy
* listenTruthy - Listen to any additional changes to the value if the value is truthy
* getTruthyOnce - Invoke the callback immediately or on any additional changes to the value if the value is truthy one time only
* listenTruthyOnce - Listen to any additional changes to the value if the value is truthy one time only
* getFalsy- Invoke the callback immediately and on any additional changes to the value if the value is falsy
* listenFalsy - Listen to any additional changes to the value if the value is falsy
* getFalsyOnce - Invoke the callback immediately or on any additional changes to the value if the value is falsy one time only
* listenFalsyOnce - Listen to any additional changes to the value if the value is falsy one time only
* getDefined- Invoke the callback immediately and on any additional changes to the value if the value is defined
* listenDefined - Listen to any additional changes to the value if the value is defined
* getDefinedOnce - Invoke the callback immediately or on any additional changes to the value if the value is defined one time only
* listenDefinedOnce - Listen to any additional changes to the value if the value is defined one time only
* unbind - Unbinds the given object from the callback
* loading
* isLoading

# Blog Posts

http://briantakita.com/articles/backbone-signal-practical-reactive-programming-in-javascript/

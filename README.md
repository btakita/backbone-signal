backbone-signal
===============

A rich Reactive Programming api on Backbone Models. It is composable, allows you to encapsulate loader logic,
 and have fine grained control over listening to change events.

# Usage

    // backbone-signal extends Backbone.Model
    var app = new Backbone.Model();

    // Create a signal on the app Model. The "slot" is the fb.login.status variable on the app Model.
    var fbLoginStatusSignal = app.signal('fb.login.status').setLoader(function() {
      FB.getLoginStatus(setFbLoginStatus, true);
      FB.Event.subscribe("auth.statusChange", setFbLoginStatus);
    }).setUnloader(function() {
        unsubscribe();
      });
    function setFbLoginStatus(loginStatus) {
      fbLoginStatusSignal.set(loginStatus);
    }
    function unsubscribe() {
      FB.Event.unsubscribe("auth.statusChange", setFbLoginStatus);
    }

    // The callback argument to setLoader is called with currentUserSignal.load() and app.get("current_user") == null
    var fbUserSignal = app.signal("fb_user").setLoader(function() {
      fbLoginStatusSignal.load().get(currentUserSignal, function() {
        if (loginStatus.status == "connected") {
          FB.api("/me", function(user) {
            if (user.error) {
              fbUserSignal.set(false);
            } else {
              fbUserSignal.set(_.extend({
                image: user ? "https://graph.facebook.com/" + user.id + "/picture" : null
              }, user));
            }
          });
        } else {
         fbUserSignal.set(false);
        }
      });
    });

    // Loads the prints the fbUser.name when fbUser is truthy
    // Note that if fbUserSignal.value() is truthy, the callback will be immediately invoked.
    // The callback will also be invoked when fbUserSignal.value() changes with another truthy value.
    fbUserSignal.load().getTruthy(function(app, fbUser) {
      console.info(fbUser.name);
    });

    // Loads the prints the if fbUser is logged in when fbUserSignal.value() is defined (not null nor undefined)
    fbUserSignal.load().getDefined(function(app, fbUser) {
      console.info("Logged in?", !!(fbUser));
    });

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
* unset - Unets the value
* value - Returns the value

## Getters/Listeners

* get - Invoke the callback immeditately and on any additional changes to the value
* listen - Listen to any additional changes to the value (does not invoke the callback immeditately)
* getOnce - Invoke the callback immeditately one time
* listenOnce - Listen to any additional changes to the value one time
* getTruthy - Invoke the callback immeditately and on any additional changes to the value if the value is truthy
* listenTruthy - Listen to any additional changes to the value if the value is truthy
* getTruthyOnce - Invoke the callback immeditately or on any additional changes to the value if the value is truthy one time only
* listenTruthyOnce - Listen to any additional changes to the value if the value is truthy one time only
* getFalsy- Invoke the callback immeditately and on any additional changes to the value if the value is falsy
* listenFalsy - Listen to any additional changes to the value if the value is falsy
* getFalsyOnce - Invoke the callback immeditately or on any additional changes to the value if the value is falsy one time only
* listenFalsyOnce - Listen to any additional changes to the value if the value is falsy one time only
* getDefined- Invoke the callback immeditately and on any additional changes to the value if the value is defined
* listenDefined - Listen to any additional changes to the value if the value is defined
* getDefinedOnce - Invoke the callback immeditately or on any additional changes to the value if the value is defined one time only
* listenDefinedOnce - Listen to any additional changes to the value if the value is defined one time only
* unbind - Unbinds the given object from the callback
* loading
* isLoading

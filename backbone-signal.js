// Copyright by Brian Takita, 2013 Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function() {
  function Signal(target, attributeName) {
    this.target = target;
    this.attributeName = attributeName;
    this.changeKey = "change:" + attributeName;
    this.loadingKey = attributeName + ":loading";
    this.changeLoadingKey = "change:" + attributeName + ":loading";
  }
  _.extend(Signal.prototype, Backbone.Events, {
    setLoader: function(loader) {
      this.loader = loader;
      return this;
    },
    unsetLoader: function() {
      this.loader = undefined;
      return this;
    },
    load: function() {
      var value = this.value();
      /*jshint eqnull: true */
      if (value == null && !getLoading(this)) {
        this.forceLoad.apply(this, arguments);
      }
      return this;
    },
    forceLoad: function() {
      if (this.loader) {
        setLoading(this, true);
        var self = this;
        this.getDefinedOnce(this.target, function() {
          unsetLoading(self);
        });
        this.loader.apply(this, arguments);
      }
      return this;
    },
    reload: function() {
      this.unload();
      return this.forceLoad.apply(this, arguments);
    },
    unload: function() {
      if (this.unloader) {
        this.unloader.call(this, this.target);
      }
    },
    setUnloader: function(loader) {
      this.unloader = loader;
      return this;
    },
    unsetUnloader: function() {
      this.unloader = undefined;
      return this;
    },
    set: function(value) {
      this.target.set(this.attributeName, value);
      return this;
    },
    unset: function(key) {
      this.set(null);
      return this;
    },
    value: function() {
      return this.target.get(this.attributeName);
    },
    get: function(listener, cb) {
      this.listen(listener, cb);
      cb.call(this, this.target, this.value());
      return this;
    },
    listen: function(listener, cb) {
      var boundCb = _.bind(cb, this);
      listener.listenTo(this.target, this.changeKey, boundCb);
      return this;
    },
    getOnce: function(listener, cb) {
      cb.call(this, this.target, this.value());
      return this;
    },
    listenOnce: function(listener, cb) {
      var boundCb = _.bind(cb, this);
      listener.listenToOnce(this.target, this.changeKey, boundCb);
      return this;
    },
    getTruthy: function(listener, cb) {
      var boundCb = bindTruthy(cb, this);
      boundCb(this.target, this.value());
      listenTo(this, listener, boundCb);
      return this;
    },
    listenTruthy: function(listener, cb) {
      var boundCb = bindTruthy(cb, this);
      listenTo(this, listener, boundCb);
      return this;
    },
    getTruthyOnce: function(listener, cb) {
      var boundCb = bindTruthyOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      boundCb(this.target, this.value());
      return this;
    },
    listenTruthyOnce: function(listener, cb) {
      var boundCb = bindTruthyOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      return this;
    },
    getFalsy: function(listener, cb) {
      var boundCb = bindFalsy(cb, this);
      listenTo(this, listener, boundCb);
      boundCb(this.target, this.value());
      return this;
    },
    listenFalsy: function(listener, cb) {
      var boundCb = bindFalsy(cb, this);
      listenTo(this, listener, boundCb);
      return this;
    },
    getFalsyOnce: function(listener, cb) {
      var boundCb = bindFalsyOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      boundCb(this.target, this.value());
      return this;
    },
    listenFalsyOnce: function(listener, cb) {
      var boundCb = bindFalsyOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      return this;
    },
    getDefined: function(listener, cb) {
      var boundCb = bindDefined(cb, this);
      listenTo(this, listener, boundCb);
      boundCb(this.target, this.value());
      return this;
    },
    listenDefined: function(listener, cb) {
      var boundCb = bindDefined(cb, this);
      listenTo(this, listener, boundCb);
      return this;
    },
    getDefinedOnce: function(listener, cb) {
      var boundCb = bindDefinedOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      boundCb(this.target, this.value());
      return this;
    },
    listenDefinedOnce: function(listener, cb) {
      var boundCb = bindDefinedOnce(this, listener, cb);
      listenTo(this, listener, boundCb);
      return this;
    },
    unbind: function(listener, cb) {
      listener.stopListening(this.target, this.attributeName && this.changeKey, cb);
      return this;
    },
    loading: function(listener, cb) {
      var boundCb = bindTruthy(cb, this.target);
      if (getLoading(this)) {
        boundCb(this.target, getLoading(this));
      }
      listener.listenTo(this.target, this.changeLoadingKey, boundCb);
      return this;
    },
    isLoading: function() {
      return !!(getLoading(this));
    }
  });
  function bindTruthy(cb, target) {
    return function(model, value) {
      if (value) {cb.apply(target, arguments);}
    };
  }
  function bindFalsy(cb, target) {
    return function(model, value) {
      if (!value) {cb.apply(target, arguments);}
    };
  }
  function bindDefined(cb, target) {
    return function(model, value) {
      if (value !== undefined && value !== null) {
        cb.apply(target, arguments);
      }
    };
  }
  function getLoading(signal) {
    return signal.target.get(signal.loadingKey);
  }
  function setLoading(signal, value) {
    return signal.target.set(signal.loadingKey, value);
  }
  function unsetLoading(signal) {
    return signal.target.set(signal.loadingKey, null);
  }
  function listenTo(signal, listener, boundCb) {
    listener.listenTo(signal.target, signal.changeKey, boundCb);
    return signal;
  }
  function bindTruthyOnce(signal, listener, cb) {
    return function getTruthyOnceCb(model, value) {
      if (value) {
        signal.unbind(listener, getTruthyOnceCb);
        cb.apply(signal, arguments);
      }
    };
  }
  function bindFalsyOnce(signal, listener, cb) {
    return function getFalsyOnceCb(model, value) {
      if (!value) {
        signal.unbind(listener, getFalsyOnceCb);
        cb.apply(signal, arguments);
      }
    };
  }
  function bindDefinedOnce(signal, listener, cb) {
    return function getDefinedOnceCb(model, value) {
      if (value !== undefined && value !== null) {
        signal.unbind(listener, getDefinedOnceCb);
        cb.apply(signal, arguments);
      }
    };
  }
  var api = {
    signal: function(attributeName) {
      var signalKey = attributeName + ".signal";
      var signalValue = this.get(signalKey);
      if (!signalValue) {
        signalValue = new Signal(this, attributeName);
        this.set(signalKey, signalValue);
      }
      return signalValue;
    }
  };
  _.extend(Backbone.Model.prototype, api);
  if (typeof module !== "undefined") {
    if (module.exports) {
      module.exports = api;
    }
  }
})();
'use strict';

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var shallowEqual = require('react/lib/shallowEqual');
var CHANGE_EVENT = 'change';

var StoreUtils = {
  createStore(spec) {
    var store = merge(EventEmitter.prototype, merge(spec, {
      emitChange() {
        this.emit(CHANGE_EVENT);
      },

      addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      }
    }));

    _.forEach(store, function(val, key) {
      if (_.isFunction(val)) {
        store[key] = store[key].bind(store);
      }
    });

    store.setMaxListeners(0);
    return store
  }
}

module.exports = StoreUtils;
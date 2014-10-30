'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _geo_data = []

var GEOStore = createStore({
  get() {
    return _geo_data
  }
})

GEOStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  if(response && payload.action.type === 'REQUEST_GEO_SUCCESS') {
    _geo_data = response
  }

  GEOStore.emitChange()
})

module.exports = GEOStore
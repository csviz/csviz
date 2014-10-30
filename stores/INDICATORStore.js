'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _indicator_data = []

var IndicatorStore = createStore({
  get() {
    return _indicator_data
  }
})

IndicatorStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  if(response && payload.action.type === 'REQUEST_INDICATOR_SUCCESS') {
    _indicator_data = response
  }

  IndicatorStore.emitChange()
})

module.exports = IndicatorStore
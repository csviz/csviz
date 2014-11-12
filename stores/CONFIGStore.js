'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _config_data = {}

var CONFIGStore = createStore({
  get() {
    return _config_data
  }
})

CONFIGStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  if(response && payload.action.type === 'REQUEST_CONFIG_SUCCESS') {
    _config_data = response
  }

  CONFIGStore.emitChange()
})

module.exports = CONFIGStore
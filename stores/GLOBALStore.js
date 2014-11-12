'use strict'

var _ = require('lodash')

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _global_data = []
var _selected_indicator = null
var _selected_year = null

function setSelectedIndicator(indicator) {
  _selected_indicator = indicator
}

function setSelectedYear(year) {
  _selected_year = year
}

var IndicatorStore = createStore({
  get() {
    return _global_data
  },

  getSelectedIndicator() {
    return _selected_indicator
  },

  getSelectedYear() {
    return _selected_year
  }
})

IndicatorStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  switch(payload.action.type) {
    case ActionTypes.REQUEST_INDICATOR_SUCCESS:
      _global_data = response

      // set default indicator
      setSelectedIndicator(Object.keys(response.meta.indicators)[0])
      break

    case ActionTypes.CHANGE_INDICATOR:
      setSelectedIndicator(response)
      // also check if there's year filed
      if(_global_data.meta.indicators[response].years && !_selected_year) {
        setSelectedYear(_global_data.meta.indicators[response].years[0])
      }
      break

    case ActionTypes.CHANGE_SELECTED_YEAR:
      setSelectedYear(response)
      break
  }

  IndicatorStore.emitChange()
})

module.exports = IndicatorStore
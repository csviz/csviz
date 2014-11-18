'use strict'

var _ = require('lodash')

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _global_data = []
var _selected_indicator = null
var _selected_year = null
var _selected_country = null

function setSelectedIndicator(indicator) {
  _selected_indicator = indicator
}

function setSelectedYear(year) {
  _selected_year = year
}

function setSelectedCountry(country) {
  _selected_country = country
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
  },

  getSelectedCountry() {
    return _selected_country
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
      setSelectedCountry(Object.keys(response.meta.locations)[0])
      IndicatorStore.emitChange()
      break

    case ActionTypes.CHANGE_INDICATOR:
      setSelectedIndicator(response)
      // also check if there's year filed
      if(!_.isEmpty(_global_data) && _global_data.meta.indicators[response].years && !_selected_year) {
        setSelectedYear(_global_data.meta.indicators[response].years[0])
      }
      IndicatorStore.emitChange()
      break

    case ActionTypes.CHANGE_SELECTED_YEAR:
      setSelectedYear(response)
      IndicatorStore.emitChange()
      break

    case ActionTypes.CHANGE_SELECTED_COUNTRY:
      setSelectedCountry(response)
      IndicatorStore.emitChange()
      break
  }


})

module.exports = IndicatorStore
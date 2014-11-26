'use strict'

var _ = require('lodash')

var AppDispatcher = require('../dispatcher/AppDispatcher')
var createStore= require('../utils/StoreUtils').createStore
var ActionTypes = require('../constants/ActionTypes')

var _data = {}
var _global_data = {}
var _config_data = {}
var _geo_data = []
var _selected_indicator = null
var _selected_year = null
var _selected_country = null

var INDICATOR_CHANGE_EVENT = 'indicator change'
var COUNTRY_CHANGE_EVENT = 'country change'
var YEAR_CHANGE_EVENT = 'year change'

function setSelectedIndicator(indicator) {
  _selected_indicator = indicator
}

function setSelectedYear(year) {
  _selected_year = year
}

function setSelectedCountry(country) {
  _selected_country = country
}

var Store = createStore({
  getAll() {
    return _data
  },

  getSelectedIndicator() {
    return _selected_indicator
  },

  getSelectedYear() {
    return _selected_year
  },

  getSelectedCountry() {
    return _selected_country
  },

  addIndicatorChangeListener(callback) {
    this.on(INDICATOR_CHANGE_EVENT, callback)
  },

  emitIndicatorChange() {
    this.emit(INDICATOR_CHANGE_EVENT)
  },

  addCountryChangeListener(callback) {
    this.on(COUNTRY_CHANGE_EVENT, callback)
  },

  emitCountryChange() {
    this.emit(COUNTRY_CHANGE_EVENT)
  },

  addYearChangeListener(callback) {
    this.on(YEAR_CHANGE_EVENT, callback)
  },

  emitYearChange() {
    this.emit(YEAR_CHANGE_EVENT)
  }
})

Store.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  switch(payload.action.type) {
    case ActionTypes.REQUEST_DATA_SUCCESS:
      _data = response

      var meta = response.global.meta
      var defaultIndicator = Object.keys(meta.indicators)[0]

      setSelectedIndicator(defaultIndicator)
      Store.emitChange()
      Store.emitIndicatorChange()
      break

    case ActionTypes.CHANGE_INDICATOR:
      setSelectedIndicator(response)

      // set default year if the year is still empty
      if (_data && _data.configs.indicators[response].years.length && _.isEmpty(_selected_year)) {
        setSelectedYear(_data.configs.indicators[response].years[0])
      }

      Store.emitIndicatorChange()
      break

    case ActionTypes.CHANGE_SELECTED_COUNTRY:
      setSelectedCountry(response)
      Store.emitCountryChange()
      break

    case ActionTypes.CHANGE_SELECTED_YEAR:
      setSelectedYear(response)
      Store.emitYearChange()
      break
  }

})

module.exports = Store
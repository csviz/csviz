'use strict'

var _ = require('lodash')
var EventEmitter = require('events').EventEmitter
var objectAssign = require('object-assign')

var AppDispatcher = require('../dispatcher/AppDispatcher')
var ActionTypes = require('../constants/ActionTypes')

var CHANGE_EVENT = 'change'
var YEAR_CHANGE_EVENT = 'year change'
var COUNTRY_CHANGE_EVENT = 'country change'
var INDICATOR_CHANGE_EVENT = 'indicator change'
var TOGGLE_SEARCH_EVNET = 'toggle search'
var TOGGLE_LEGEND_EVNET = 'toggle legend'

// init data
var _data = {}
var _selected_year, _selected_indicator, _selected_country, _showSearch = false, _showLegend = false

// init store
var Store = objectAssign({}, EventEmitter.prototype, {
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

  getSearchStatus() {
    return _showSearch
  },

  getLegendStatus() {
    return _showLegend
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  emitChange() {
    this.emit(CHANGE_EVENT)
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
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
  },

  addSearchChangeListener(callback) {
    this.on(TOGGLE_SEARCH_EVNET, callback)
  },

  emitSearchChange() {
    this.emit(TOGGLE_SEARCH_EVNET)
  },

  addLegendChangeListener(callback) {
    this.on(TOGGLE_LEGEND_EVNET, callback)
  },

  emitLegendChange() {
    this.emit(TOGGLE_LEGEND_EVNET)
  }
})

function setSelectedIndicator(indicator) {
  _selected_indicator = indicator
}

function setSelectedYear(year) {
  _selected_year = year
}

function setSelectedCountry(country) {
  _selected_country = country
}

function setSearchStatus(status) {
  _showSearch = status
}

function setLegendStatus(status) {
  _showLegend = status
}

Store.dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action
  var response = action.response

  switch(payload.action.type) {
    case ActionTypes.REQUEST_DATA_SUCCESS:
      _data = response

      // setSelectedIndicator(defaultIndicator)
      Store.emitChange()
      // Store.emitIndicatorChange()
      break

    case ActionTypes.CHANGE_INDICATOR:
      setSelectedIndicator(response)

      try {
        if (_data.configs && _data.configs.indicators[response].years.length) {
          setSelectedYear(_data.configs.indicators[response].years[0])
        }
      } catch (e) {
        console.error('try to set default year error ', err)
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

    case ActionTypes.CHANGE_SEARCH_STATUS:
      setSearchStatus(response)
      Store.emitSearchChange()
      break

    case ActionTypes.CHANGE_LEGEND_STATUS:
      setLegendStatus(response)
      Store.emitLegendChange()
      break
  }

})

module.exports = Store
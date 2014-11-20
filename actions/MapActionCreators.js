'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var API = require('../utils/API')
var ActionTypes = require('../constants/ActionTypes')

var MapActionCreators = {
  requestConfig() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_CONFIG
    })

    API.config()
  },

  requestGlobal() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_INDICATOR
    })

    API.global()
  },

  requestGEO() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_GEO
    })

    API.geo()
  },

  changeIndicator(indicator) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CHANGE_INDICATOR,
      response: indicator
    })
  },

  changeSelectedYear(year) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CHANGE_SELECTED_YEAR,
      response: year
    })
  },

  changeSelectedCountry(country) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CHANGE_SELECTED_COUNTRY,
      response: country
    })
  }
}

module.exports = MapActionCreators
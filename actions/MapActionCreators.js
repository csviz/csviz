'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var API = require('../utils/API')
var ActionTypes = require('../constants/ActionTypes')

var MapActionCreators = {
  requestAll() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_DATA
    })

    API.all()
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
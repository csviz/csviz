'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var API = require('../utils/API')
var ActionTypes = require('../constants/ActionTypes')

var MapActionCreators = {
  requestAll(queries) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_DATA
    })

    API.all(queries)
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
  },

  changeSearchStatus(status) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CHANGE_SEARCH_STATUS,
      response: status
    })
  }
}

module.exports = MapActionCreators
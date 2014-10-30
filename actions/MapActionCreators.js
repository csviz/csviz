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

  requestIndicator() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_INDICATOR
    })

    API.indicator()
  },

  requestGEO() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_GEO
    })

    API.geo()
  }
}

module.exports = MapActionCreators
'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var API = require('../utils/API');
var ActionTypes = require('../constants/ActionTypes');

var MapActionCreators = {
  requestConfig() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_CONFIG
    })

    API.config()
  },

  requestCSV() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_CSV
    })

    API.csv()
  },

  requestGEO() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_GEO
    })

    API.geo()
  }
}

module.exports = MapActionCreators;
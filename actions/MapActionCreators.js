'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var API = require('../utils/API');
var ActionTypes = require('../constants/ActionTypes');

var MapActionCreators = {
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
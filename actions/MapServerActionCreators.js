'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

var MapServerActionCreators = {
  handleCSVSuccess: function(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CSV_SUCCESS,
      response: response
    })
  },

  handleCSVError: function(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CSV_ERROR
    })
  },

  handleGEOSuccess: function(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_GEO_SUCCESS,
      response: response
    })
  },

  handleGEOError: function(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_GEO_ERROR
    })
  }
}

module.exports = MapServerActionCreators;
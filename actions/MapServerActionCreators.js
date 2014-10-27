'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

var MapServerActionCreators = {
  handleGEOSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CSV_SUCCESS,
      response: response
    })
  },

  handleCSVError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CSV_ERROR
    })
  },

  handleGEOSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_GEO_SUCCESS,
      response: response
    })
  },

  handleGEOError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_GEO_ERROR
    })
  },
}

module.exports = MapServerActionCreators;
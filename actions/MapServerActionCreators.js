'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

var MapServerActionCreators = {

  // configuration
  handleCONFIGSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CONFIG_SUCCESS,
      response: response
    })
  },

  handleCONFIGError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CONFIG_ERROR
    })
  },

  // indicator data
  handleINDICATORSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_INDICATOR_SUCCESS,
      response: response
    })
  },

  handleINDICATORError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_INDICATOR_ERROR
    })
  },

  // geo data
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
  }
}

module.exports = MapServerActionCreators;
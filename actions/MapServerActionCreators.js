'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher')
var ActionTypes = require('../constants/ActionTypes')

var MapServerActionCreators = {

  // all data
  handleDATASuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_DATA_SUCCESS,
      response: response
    })
  },

  handleDATAError(err) {
    console.log(err)

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_DATA_ERROR
    })
  }

}

module.exports = MapServerActionCreators
'use strict'

var Dispatcher = require('flux').Dispatcher
var objectAssign = require('react/lib/Object.assign')
var PayloadSources = require('../constants/PayloadSources')

var AppDispatcher = objectAssign(new Dispatcher(), {
  handleServerAction(action) {
    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.')
    }

    this.dispatch({
      source: PayloadSources.SERVER_ACTION,
      action: action
    })
  },

  handleViewAction(action) {
    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.')
    }

    this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action: action
    })
  }

})

module.exports = AppDispatcher

'use strict'

var objectAssign = require('object-assign')

var updateQueryMixin = {
  updateQuery(data) {
    if(typeof data != 'object') throw new Error('query should be an object')

    var queries = this.getQuery()
    var _queries = objectAssign(queries, data)
    this.replaceWith('app', {}, _queries)
  }
}

module.exports = updateQueryMixin
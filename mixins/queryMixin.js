'use strict'
var objectAssign = require('object-assign')

var updateQueryMixin = {
  updateQuery(data) {
    var queries = this.getQuery()
    var _queries = objectAssign(queries, data)
    this.replaceWith('app', {}, _queries)
  }
}

module.exports = updateQueryMixin
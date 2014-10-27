'use strict';

var xhr = require('xhr')

var API = {
  csv: function(csv, cb) {
    xhr({ responseType: 'arraybuffer', url: csv, timeout: 100 * 1000}, cb)
  },

  geo: function(geo, cb) {
    xhr({ responseType: 'json', url: geo, timeout: 100 * 1000}, cb)
  }
}

module.exports = API
'use strict';

var xhr = require('xhr')
var topojson = require('topojson')
var MapServerActionCreators = require('../actions/MapServerActionCreators')

// configs
// var config = require('../config.json')
var geoUrl = '../data/alternative_country_topo.json'

var API = {
  csv(csv, cb) {
    xhr({ responseType: 'arraybuffer', url: csv, timeout: 100 * 1000}, cb)
  },

  geo() {
    xhr({ responseType: 'json', url: geoUrl, timeout: 100 * 1000}, function(err, resp, data) {
      if (err) {
        return MapServerActionCreators.handleGEOError(err)
      }
      MapServerActionCreators.handleGEOSuccess(topojson.feature(data, data.objects['Aqueduct_country']).features)
    })
  }
}

module.exports = API
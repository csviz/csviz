'use strict';

var xhr = require('xhr')
var topojson = require('topojson')
var MapServerActionCreators = require('../actions/MapServerActionCreators')

var geoUrl = '../data/alternative_country_topo.json'
var configUrl = '../data/configuration.json'
var indicatorUrl = '../data/indicators.json'

var API = {
  config() {
    xhr({ responseType: 'json', url: configUrl, timeout: 100 * 1000}, function(err, resp, data) {
      if (err) {
        return MapServerActionCreators.handleCONFIGError(err)
      }
      MapServerActionCreators.handleCONFIGSuccess(data)
    })
  },

  indicator() {
    xhr({ responseType: 'json', url: indicatorUrl, timeout: 100 * 1000}, function(err, resp, data) {
      if (err) {
        return MapServerActionCreators.handleINDICATORError(err)
      }
      MapServerActionCreators.handleINDICATORSuccess(data)
    })
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
'use strict';

var axios = require('axios')
var topojson = require('topojson')
var MapServerActionCreators = require('../actions/MapServerActionCreators')

var geoUrl = '../data/alternative_country_topo.json'
var configUrl = '../data/configuration.json'
var globalUrl = '../data/global.json'

var API = {
  config() {
    axios.get(configUrl).
      then(function(res) {
        MapServerActionCreators.handleCONFIGSuccess(res.data)
      })
      .catch(function(err) {
        MapServerActionCreators.handleCONFIGError(err)
      })
  },

  global() {
    axios.get(globalUrl).
      then(function(res) {
        MapServerActionCreators.handleINDICATORSuccess(res.data)
      })
      .catch(function(err) {
        MapServerActionCreators.handleINDICATORError(err)
      })
  },

  geo() {
    axios.get(geoUrl).
      then(function(res) {
        MapServerActionCreators.handleGEOSuccess(topojson.feature(res.data, res.data.objects['Aqueduct_country']).features)
      })
      .catch(function(err) {
        MapServerActionCreators.handleGEOError(err)
      })
  }
}

module.exports = API
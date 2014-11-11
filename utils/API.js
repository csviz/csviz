'use strict'

var axios = require('axios')
var topojson = require('topojson')
var MapServerActionCreators = require('../actions/MapServerActionCreators')

var config = require('../config.json')
var geoPath = config.geoPath
var configPath = config.configPath
var globalPath = config.globalPath

var API = {
  config() {
    axios.get(configPath).
      then(function(res) {
        MapServerActionCreators.handleCONFIGSuccess(res.data)
      })
      .catch(function(err) {
        MapServerActionCreators.handleCONFIGError(err)
      })
  },

  global() {
    axios.get(globalPath).
      then(function(res) {
        MapServerActionCreators.handleINDICATORSuccess(res.data)
      })
      .catch(function(err) {
        MapServerActionCreators.handleINDICATORError(err)
      })
  },

  geo() {
    axios.get(geoPath).
      then(function(res) {
        MapServerActionCreators.handleGEOSuccess(topojson.feature(res.data, res.data.objects['Aqueduct_country']).features)
      })
      .catch(function(err) {
        MapServerActionCreators.handleGEOError(err)
      })
  }
}

module.exports = API
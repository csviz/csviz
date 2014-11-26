'use strict'

var axios = require('axios')
var topojson = require('topojson')
var MapServerActionCreators = require('../actions/MapServerActionCreators')

var _config = require('../config.json')
var geoPath = _config.geoPath
var configPath = _config.configPath
var globalPath = _config.globalPath

var API = {
  all() {
    axios.all([axios.get(configPath), axios.get(globalPath), axios.get(geoPath)])
      .then(function(data) {
        var _data = {}
        if (data) {
          _data['configs'] = data[0].data
          _data['global'] = data[1].data
          _data['geo'] = topojson.feature(data[2].data, data[2].data.objects['Aqueduct_country']).features
        }

        MapServerActionCreators.handleDATASuccess(_data)
        return true
      })
      .catch(function(err) {
        MapServerActionCreators.handleDATAError(err)
      })
  }
}

module.exports = API

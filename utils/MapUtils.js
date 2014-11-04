'use strict'

var _ = require('lodash')
var Rainbow = require('./RainbowVis')

var MapUtils = {

  getNumberColor(value, indicators, configs, selected_indicator) {

    var max = _.max(indicators, function(country) { return country[selected_indicator]})[selected_indicator]
    var min = _.min(indicators, function(country) { return country[selected_indicator]})[selected_indicator]
    var start = configs.ui.choropleth.start
    var end = configs.ui.choropleth.end

    return MapUtils.getColorCode(min, max, start, end, value)
  },

  getSelectColor(value, configs, selected_indicator) {
    var d = configs.indicators[selected_indicator].mapping[value]

    var max = _.max(configs.indicators[selected_indicator].mapping)
    var min = _.min(configs.indicators[selected_indicator].mapping)
    var start = configs.ui.choropleth.start
    var end = configs.ui.choropleth.end

    return MapUtils.getColorCode(min, max, start, end, d)
  },

  getColorCode(min, max, start, end, d) {
    var rainbow = new Rainbow()

    // ['#ffffff', ... '#000000']
    rainbow.setSpectrum(start, end)
    // [0, ... 90]
    rainbow.setNumberRange(min, max)

    return '#' + rainbow.colorAt(d)
  }
}

module.exports = MapUtils
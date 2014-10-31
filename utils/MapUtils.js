'use strict';

var _ = require('lodash')

var COLOR_COUNT = 6

var MapUtils = {

  getColor(value, ranges){
    if (!value) return 'rgba(0,0,0,.0)'
    if (value >= ranges.ranges[5]) return 'rgba(7,42,96,.6)'
    if (value >= ranges.ranges[4]) return 'rgba(27,63,116,.6)'
    if (value >= ranges.ranges[3]) return 'rgba(58,97,153,.6)'
    if (value >= ranges.ranges[2]) return 'rgba(96,128,176,.6)'
    if (value >= ranges.ranges[1]) return 'rgba(119,153,196,.6)'
    return 'rgba(156,183,217,.6)'
  },

  getRanges(indicators, selected_indicator) {
    var values = Object.keys(indicators)
    .map(function(country) {
      if (indicators[country][selected_indicator]) return indicators[country][selected_indicator]
    })
    .filter(function(val) {
      return (val !== undefined && '' + Number(val) !== 'NaN')
    })

    var max = _.max(values)
    var min = _.min(values)

    var rangePoints = []
    var step = (max - min) / COLOR_COUNT
    for (var i = 0; i < COLOR_COUNT; i++) {
      rangePoints.push(min + i*step)
    }
    return {
      min: min,
      max: max,
      ranges: rangePoints
    }
  }
}

module.exports = MapUtils;
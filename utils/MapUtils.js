'use strict'

var _ = require('lodash')
var numeral = require('numeral')
// var Rainbow = require('./RainbowVis')

var MapUtils = {

  /**
   * Given a value, to calculate the color value from the current indicator and confif data
   */
  getNumberColor(value, configs, meta, selected_indicator) {

    var min = meta.indicators[selected_indicator].min_value
    var max = meta.indicators[selected_indicator].max_value
    // var start = configs.ui.choropleth.start
    // var end = configs.ui.choropleth.end
    var colors = configs.ui.choropleth
    var steps = configs.ui.choropleth.length
    var step = (max - min)/steps

    var colorIndex = ((value - min)/step).toFixed()

    if (colorIndex <= 0) {
      colorIndex = 0
    }

    if (colorIndex >= steps) {
      colorIndex = steps - 1
    }

    return colors[colorIndex]

    // return MapUtils.getColorFromRange(value, ranges, colors)
  },

  getSelectColor(value, configs, selected_indicator) {
    var d = configs.indicators[selected_indicator].mapping[value]

    var max = _.max(configs.indicators[selected_indicator].mapping)
    var min = _.min(configs.indicators[selected_indicator].mapping)
    var start = configs.ui.choropleth.start
    var end = configs.ui.choropleth.end

    return MapUtils.getColorCode(min, max, start, end, d)
  },

  // getColorCode(min, max, start, end, d) {
  //   var rainbow = new Rainbow()

  //   // ['#ffffff', ... '#000000']
  //   rainbow.setSpectrum(start, end)
  //   // [0, ... 90]
  //   rainbow.setNumberRange(min, max)

  //   return '#' + rainbow.colorAt(d)
  // },

  /**
   * A simple template helper function to genrerate markup from data
   */
  compileTemplate(tpl, data) {
    var re = /{{(.+?)}}/g,
      reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
      code = 'with(obj) { var r=[];\n',
      cursor = 0,
      result,
      match
    var add = function(line, js) {
      js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    }
    while(match = re.exec(tpl)) {
      add(tpl.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }
    add(tpl.substr(cursor, tpl.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
    try { result = new Function('obj', code).apply(data, [data]); }
    catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
    return result
  },

  /**
   * Normalize country name
   */
  getCountryNameId(name) {
    var ALLOWED_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz_'

    return name
          .toLowerCase()
          .trim()
          .replace(' ', '_')
          .split('')
          .filter(function(char) {
            if (_.contains(ALLOWED_CHARS, char)) {
              return char
            }
          })
          .join('')
  },

  /**
   * Center the given country on the map
   */
  centerOnCountry(countryName, map, countryLayer) {
    if (countryLayer && map) {
      countryLayer.eachLayer(function(layer) {
        if(MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME']) === countryName) {
          map.fitBounds(layer.getBounds())

          layer.setStyle({ weight: 3, opacity: 0.3, fillOpacity: 0.9 })
        }
      })
    }
  },

  /**
   * Get Legend Html with the selected Indicator
   */
  getLegendHTML(configs, global, selected_indicator) {
    var indicatorName = configs.indicators[selected_indicator].name

    var labels = [], from, to
    var min = global.meta.indicators[selected_indicator].min_value.toFixed()
    var max = global.meta.indicators[selected_indicator].max_value.toFixed()
    var colors = configs.ui.choropleth
    var steps = configs.ui.choropleth.length
    var step = ((max - min)/steps).toFixed()

    for (var i = 0; i < steps; i++) {
      if (i == 0) {
        from = parseInt(min)
        to = parseInt(from) + parseInt(step)
      } else {
        from = parseInt(to + 1)
        to = parseInt(from) + parseInt(step)
      }
      labels.push(`<li><span class='swatch' style='background:${colors[i]}'></span>${numeral(from).format('0.0a')}${'&ndash;'}${numeral(to).format('0.0a')}</li>`)
    }

    return `<span>${indicatorName}</span><ul class='legend-list'>${labels.join('')}</ul>`
  }
}

module.exports = MapUtils
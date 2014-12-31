'use strict'

var _ = require('lodash')
var numeral = require('numeral')
var d3 = require('d3')

var MapUtils = {

  /**
   * Check n if is an integer
   */
  isInt(n) {
    return n % 1 === 0
  },

  /**
   * Given a value, to calculate the color value from the current indicator and confif data
   */
  getNumberColor(value, configs, meta, selected_indicator) {
    var min = meta.indicators[selected_indicator].min_value
    var max = meta.indicators[selected_indicator].max_value

    // TODO: read color from individual indicator config

    var colors = configs.ui.choropleth
    var steps = configs.ui.choropleth.length
    var step = (max - min)/steps
    var colorIndex = ((value - min)/step).toFixed()

    if (colorIndex <= 0) { colorIndex = 0 }
    if (colorIndex >= steps) { colorIndex = steps - 1 }

    return colors[colorIndex]

  },

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
    return name.toLowerCase().trim().replace(/\([^)]*\)/g, '').trim().replace(/ /g, '_').replace(/[^0-9a-z_]/g, '')
  },

  /**
   * Get Legend Html with the selected Indicator
   */
  getLegendHTML(configs, global, selected_indicator) {

    if (_.isNull(global.meta.indicators[selected_indicator].min_value) || _.isNull(global.meta.indicators[selected_indicator].max_value)) return

    var labels = [], from, to, color
    var min = global.meta.indicators[selected_indicator].min_value.toFixed()
    var max = global.meta.indicators[selected_indicator].max_value.toFixed()
    var colors = configs.ui.choropleth
    var steps = configs.ui.choropleth.length
    var step = ((max - min)/steps).toFixed()

    // legend for country with Data not available
    labels.push('<li><span class="swatch" style="background:#eeeeee"></span>Data not available</li>')

    for (var i = 0; i < steps; i++) {
      if (i == 0) {
        from = parseInt(min)
        to = parseInt(from) + parseInt(step)
      } else {
        from = parseInt(to + 1)
        to = parseInt(from) + parseInt(step)
      }
      labels.push(`<li><span class='swatch' style='background:${colors[i]}'></span>${numeral(from).format('0.0a')}${' &ndash; '}${numeral(to).format('0.0a')}</li>`)
    }

    return `<ul class='legend-list'>${labels.join('')}</ul>`
  },

  /**
   * Add a tooltip
   */
  addTooltip(map, layer, popup, indicators, selected_indicator, configs, selected_year, e) {

    var latlng = e ? e.latlng : layer.getBounds().getCenter()

    popup.setLatLng(latlng)

    var value = 'Data not available'
    var countryName = MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME'])

    if (countryName in indicators && indicators[countryName][selected_indicator] !== undefined) {
      var tooltipTemplate = configs.indicators[selected_indicator].tooltip

      // data with years
      if (configs.indicators[selected_indicator].years.length) {
        var value = indicators[countryName][selected_indicator].years[selected_year]

        if (value) {
          if (!MapUtils.isInt(value)) {
            value = indicators[countryName][selected_indicator].years[selected_year].toFixed(2)
            value = numeral(value).format('0.000')
          }
          value = MapUtils.compileTemplate(tooltipTemplate, {currentIndicator: value})
        } else {
          value = 'Data not available'
        }

      } else {
        if(indicators[countryName][selected_indicator]) {
          value = indicators[countryName][selected_indicator]
          if (value && !MapUtils.isInt(value)) {
            value = numeral(value.toFixed(2)).format('0.000')
          }
          value = MapUtils.compileTemplate(tooltipTemplate, {currentIndicator: value})
        }
      }
    }

    popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

    if (!popup._map) popup.openOn(map)
    if (!L.Browser.ie && !L.Browser.opera) layer.bringToFront()
  }
}

module.exports = MapUtils
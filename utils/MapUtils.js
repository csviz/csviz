'use strict'

var _ = require('lodash')
var numeral = require('numeral')
var d3 = require('d3')
var safeTraverse = require('./safeTraverse')
var mustache = require('mustache')

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
    var customChoropleth = safeTraverse(configs, 'indicators', selected_indicator, 'choropleth')

    // read color from individual indicator config
    if (customChoropleth) {
      var i = 0
      while (i < customChoropleth.length) {
        if (value >= customChoropleth[i].range[0] && value <= customChoropleth[i].range[1]) {
          break
        }
        i += 1
      }
      return safeTraverse(customChoropleth[i], 'color')
    } else {
      var min = safeTraverse(meta, 'indicators', selected_indicator, 'min_value')
      var max = safeTraverse(meta, 'indicators', selected_indicator, 'max_value' )
      var colors = safeTraverse(configs, 'ui', 'choropleth')
      var steps = safeTraverse(configs, 'ui', 'choropleth', 'length')

      if (max && steps) {
        var step = (max - min)/steps
        var colorIndex = ((value - min)/step).toFixed()

        if (colorIndex <= 0) { colorIndex = 0 }
        if (colorIndex >= steps) { colorIndex = steps - 1 }

        return colors[colorIndex]
      }

    }
  },

  matchContentFromTemplate(template) {
    // return template.match(/{{\s*[\w\.]+\s*}}/g)
    //   .map(function(x) { return x.match(/[\w\.]+/)[0]; });
    var list = [],
      re = /{{\s*([^}]+)\s*}}/g,
      item;

    while (item = re.exec(template))
      list.push(item[1]);

    return list
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
   * Get Country Name from ISO
   */
  getCountryNameFromMetaByISO(ISO, meta) {
    return _.findKey(meta.locations, (location, key) => {
      return location['ISO'] === ISO
    })
  },

  /**
   * Get Legend Html with the selected Indicator
   */
  getLegendHTML(configs, global, selected_indicator) {

    // the gpe stuff...
    if (selected_indicator === 'map_of_the_global_partnership_for_education') {
      var labels = []

      labels.push('<li class="fragile-container"><span class="swatch fragile"></span>Fragile State</li>')
      labels.push('<li><span class="swatch" style="background:#5c6bc0"></span>GPE Donors</li>')
      labels.push('<li><span class="swatch" style="background:#eeeeee"></span>GPE Developing Country Partners</li>')

      return `<ul class='legend-list'>${labels.join('')}</ul>`
    }

    var customChoropleth = safeTraverse(configs, 'indicators', selected_indicator, 'choropleth')

    // custom color goes first
    if(customChoropleth) {
      var labels = []
      // legend for country with Data not available
      labels.push('<li class="fragile-container"><span class="swatch fragile"></span>Fragile State</li>')
      labels.push('<li><span class="swatch" style="background:#eeeeee"></span>Data not available</li>')

      customChoropleth.forEach(function(item) {
        labels.push(`<li><span class='swatch' style='background:${item.color}'></span>${item.label}</li>`)
      })

      return `<ul class='legend-list'>${labels.join('')}</ul>`
    } else {
      var _min = safeTraverse(global, 'meta', 'indicators', selected_indicator, 'min_value')
      var _max = safeTraverse(global, 'meta', 'indicators', selected_indicator, 'max_value')
      if (_.isNull(_min) || _.isNull(_max)) return

      var labels = [], from, to, color
      var min = _min.toFixed()
      var max = _max.toFixed()

      var colors = safeTraverse(configs, 'ui', 'choropleth')
      var steps = safeTraverse(colors, 'length')
      var step = ((max - min)/steps).toFixed()

      // legend for country with Data not available
      labels.push('<li class="fragile-container"><span class="swatch fragile"></span>Fragile State</li>')
      labels.push('<li><span class="swatch" style="background:#eeeeee"></span>Data not available</li>')

      for (var i = 0; i < steps; i++) {
        if (i == 0) {
          from = parseInt(min)
          to = parseInt(from) + parseInt(step)
        } else {
          from = parseInt(to)
          to = parseInt(from) + parseInt(step)
        }
        labels.push(`<li><span class='swatch' style='background:${colors[i]}'></span>${numeral(from).format('0.0a')}${' &ndash; '}${numeral(to).format('0.0a')}</li>`)
      }

      return `<ul class='legend-list'>${labels.join('')}</ul>`
    }

  },

  getFormatFromPrecision(precision) {
    var format

    if (precision == 1) {
      format = `0.0`
    } else if (precision == 2) {
      format = `0.00`
    } else if (precision == 3) {
      format = `0.000`
    } else {
      format = `0,0`
    }

    return format
  },

  /**
   * Add a tooltip
   */
  addTooltip(map, layer, popup, global, selected_indicator, configs, selected_year, e) {

    var meta = global.meta,
      indicators = global.data.locations,
      value = 'Data not available',
      countryName = MapUtils.getCountryNameFromMetaByISO(layer.feature.properties['ISO'], meta),
      latlng = e ? e.latlng : layer.getBounds().getCenter();

    var precision = safeTraverse(configs, 'indicators', selected_indicator, 'precision')
    if (precision) precision = parseInt(precision)
    var format = MapUtils.getFormatFromPrecision(precision)
    var tooltipTemplate = safeTraverse(configs, 'indicators', selected_indicator, 'tooltip')

    popup.setLatLng(latlng)

    if (countryName in indicators && safeTraverse(indicators, countryName, selected_indicator)) {

      // gpe
      if (selected_indicator === 'map_of_the_global_partnership_for_education') {
        value = safeTraverse(indicators, countryName, selected_indicator) == 1 ? 'GPE Donors' : 'GPE Developing Country Partners'
      // data with years
      } else if (safeTraverse(configs, 'indicators', selected_indicator, 'years', 'length')) {
        value = safeTraverse(indicators, countryName, selected_indicator, 'years', selected_year)

        if (!value) {
          value = 'Data not available'
        } else {
          var dataObject = {}
          var values = MapUtils.matchContentFromTemplate(tooltipTemplate)
          if (values.length) {
            values.map((indicatorName) => {
              indicatorName = indicatorName.trim()
              var indicatorId = MapUtils.getCountryNameId(indicatorName)
              var data = safeTraverse(indicators, countryName, indicatorId, 'years', selected_year)
              dataObject[indicatorName] = numeral(data).format(format)
            })
          }

          if (tooltipTemplate) value = mustache.render(tooltipTemplate, dataObject)
        }
      // data without years
      } else {
        var dataObject = {}
        var values = MapUtils.matchContentFromTemplate(tooltipTemplate)
        if (values.length) {
          values.map((indicatorName) => {
            indicatorName = indicatorName.trim()
            var indicatorId = MapUtils.getCountryNameId(indicatorName)
            var data = safeTraverse(indicators, countryName, indicatorId, 'years', selected_year)
            dataObject[indicatorName] = numeral(data).format(format)
          })
        }

        if (tooltipTemplate) value = mustache.render(tooltipTemplate, dataObject)
      }
    }

    popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

    if (!popup._map) popup.openOn(map)
    // if (!L.Browser.ie && !L.Browser.opera) layer.bringToFront()
  }
}

module.exports = MapUtils

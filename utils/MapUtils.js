'use strict'

var _ = require('lodash')
var Rainbow = require('./RainbowVis')

var MapUtils = {

  getNumberColor(value, indicators, configs, selected_indicator, selected_year) {
    var min, max

    if (_.isUndefined(selected_year)) {
      max = _.max(indicators, function(country) { return country[selected_indicator]})[selected_indicator]
      min = _.min(indicators, function(country) { return country[selected_indicator]})[selected_indicator]
    } else {
      max = _.max(indicators, function(country) { return country[selected_indicator].years[selected_year]})[selected_indicator].years[selected_year]
      min = _.min(indicators, function(country) { return country[selected_indicator].years[selected_year]})[selected_indicator].years[selected_year]
    }

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
  },

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
  }
}

module.exports = MapUtils
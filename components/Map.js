/**
 * @jsx React.DOM
 */

var React = require('react')
var mapbox = require('mapbox.js')
var MapUtils = require('../utils/MapUtils')
var GLOBALStore = require('../stores/GLOBALStore')
var _ = require('lodash')

var COLOR_COUNT = 6
var mapbox_config =  {
  "token": "pk.eyJ1IjoiY3N2aXoiLCJhIjoiVVZIejF1ZyJ9.xFS0JJueEKUV7o0bj2IGIA",
  "type": "csviz.jhoclc79",
  "location": [32.52, 13.11],
  "zoomlevel": 3
}

var Map = React.createClass({

  displayName: 'MapComponent',

  getInitialState() {
    return {
      map: {},
      layers: []
    }
  },

  componentDidMount() {
    L.mapbox.accessToken = mapbox_config.token
    var map = L.mapbox.map('map', mapbox_config.type).setView(mapbox_config.location, mapbox_config.zoomlevel)
    this.setState({map: map})
  },

  componentWillReceiveProps: function(nextProps) {
    if (!_.isEmpty(nextProps.geo) && !_.isEmpty(nextProps.globals) && !_.isEmpty(nextProps.configs)) {
      this.updateChoropleth()
    }
  },

  updateChoropleth() {
    var map = this.state.map

    var shapes = this.props.geo
    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var indicators = this.props.globals.data.locations

    var filteredShapes = shapes.filter(function(shape) {
      return shape.properties['ISO_NAME'].toLowerCase() in indicators
    })

    // if (this.state.layers.length) {
    //   for (var layer_i in this.state.layers) {

    //   }
    // }

    console.log({
      filteredShapes: filteredShapes,
      selected_indicator: selected_indicator,
      indicators: indicators,
      configs: this.props.configs
    })

    function getRanges(indicators, selected_indicator) {
      var values = Object.keys(indicators).map(function(country) {
        if (indicators[country][selected_indicator]) return indicators[country][selected_indicator]
      })
      values = values.filter(function(val) {
        return (val !== undefined && '' + Number(val) !== 'NaN')
      })

      var max = Math.max.apply(Math, values)
      var min = Math.min.apply(Math, values)

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

    function getStyle(feature) {
      var value
      var countryName = feature.properties['ISO_NAME']

      if (countryName) {
        if (countryName.toLowerCase() in indicators) {
          value = indicators[countryName.toLowerCase()].indicators[selected_indicator]
        }
      } else {
        console.log('No name', feature)
      }

      var ranges = getRanges(indicators, selected_indicator)
      var color = getColor(value, ranges)
      return {
          weight: 0.0,
          opacity: 1,
          fillOpacity: 1,
          fillColor: color
      }
    }

    function getColor(value, ranges){
      if (!value) return 'rgba(0,0,0,.0)'
      if (value >= ranges.ranges[5]) return 'rgba(7,42,96,.6)'
      if (value >= ranges.ranges[4]) return 'rgba(27,63,116,.6)'
      if (value >= ranges.ranges[3]) return 'rgba(58,97,153,.6)'
      if (value >= ranges.ranges[2]) return 'rgba(96,128,176,.6)'
      if (value >= ranges.ranges[1]) return 'rgba(119,153,196,.6)'
      return 'rgba(156,183,217,.6)'
    }

    var countryLayer = L.geoJson(filteredShapes, {
      style: getStyle,
      onEachFeature: MapUtils.onEachFeature
    }).addTo(map)

  },

  render() {
    return (
      <div className='main card'>
        <div id='map'></div>
      </div>
    )
  }

})

module.exports = Map
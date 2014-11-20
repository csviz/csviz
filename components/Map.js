'use strict'

var React = require('react')
var mapbox = require('mapbox.js')
var MapUtils = require('../utils/MapUtils')
var MapActionCreators = require('../actions/MapActionCreators')
var GLOBALStore = require('../stores/GLOBALStore')
var _ = require('lodash')

var config = require('../config.json')
var mapbox_config = config.mapbox

var Map = React.createClass({

  displayName: 'MapComponent',

  getInitialState() {
    return {
      map: {},
      countryLayer: null,
      legend: null,
      current_selected_country: null
    }
  },

  // TODO: Clean up this part
  handleStoreChange() {
    if (this.state.countryLayer && this.state.map) {
      this.state.countryLayer.eachLayer(function(layer) {
        if(MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME']) === GLOBALStore.getSelectedCountry()) {
          this.state.map.fitBounds(layer.getBounds())

          var popup = new L.Popup({ autoPan: false })
          var indicators = this.props.globals.data.locations
          var configs = this.props.configs
          var selected_indicator = GLOBALStore.getSelectedIndicator()
          var selected_year = GLOBALStore.getSelectedYear()
          var value = 'No data'
          var cname = MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME'])

          popup.setLatLng(layer.getBounds().getCenter())

          if (cname in indicators && indicators[cname][selected_indicator] !== undefined) {
            var tooltipTemplate = configs.indicators[selected_indicator].tooltip

            // gdp with years
            if (configs.indicators[selected_indicator].years) {
              value = indicators[cname][selected_indicator].years[selected_year]
            } else {
              value = indicators[cname][selected_indicator]
            }
          }

          var value = MapUtils.compileTemplate(tooltipTemplate, {currentIndicator: value})

          popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

          if (!popup._map) popup.openOn(this.state.map)
          // window.clearTimeout(closeTooltip)

          layer.setStyle({
            weight: 3,
            opacity: 0.3,
            fillOpacity: 0.9
          })

          if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront()
          }

        }
      }.bind(this))
    }
  },

  componentDidMount() {
    GLOBALStore.addChangeListener(this.handleStoreChange)

    L.mapbox.accessToken = mapbox_config.token
    var map = L.mapbox.map('map', mapbox_config.type).setView(mapbox_config.location, mapbox_config.zoomlevel)
    this.setState({map: map})
  },

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.geo) && !_.isEmpty(nextProps.globals) && !_.isEmpty(nextProps.configs)) {
      this.updateChoropleth(nextProps.geo, nextProps.globals, nextProps.configs)
    }
  },

  updateChoropleth(geo, globals, configs) {
    var self = this
    var map = this.state.map

    var shapes = geo
    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var selected_year = GLOBALStore.getSelectedYear()
    var selected_country = GLOBALStore.getSelectedCountry()
    var indicators = globals.data.locations
    var meta = globals.meta

    // clean up existing layers
    if (this.state.countryLayer && this.state.countryLayer._layers !== undefined) {
      for (var layer_i in this.state.countryLayer._layers) {
        map.removeLayer(this.state.countryLayer._layers[layer_i])
      }
      this.setState({countryLayer: null})
    }

    var filteredShapes = shapes.filter(function(shape) {
      return MapUtils.getCountryNameId(shape.properties['ISO_NAME']) in indicators
    })

    // add country choropleth
    var countryLayer = L.geoJson(filteredShapes, {
      style: getStyle,
      onEachFeature: onEachFeature
    }).addTo(map)

    this.setState({countryLayer: countryLayer})

    // get style function
    function getStyle(feature) {
      var value, color
      var countryName = MapUtils.getCountryNameId(feature.properties['ISO_NAME'])

      if (countryName in indicators) {
        value = indicators[countryName][selected_indicator]
      } else {
        console.log('No name', feature)
      }

      switch(configs.indicators[selected_indicator].type) {

        case 'number':
          // check whether indicator has years
          if (configs.indicators[selected_indicator].years) {
            color = MapUtils.getNumberColor(value.years[selected_year], configs, meta, selected_indicator)
          } else {
            color = MapUtils.getNumberColor(value, configs, meta, selected_indicator)
          }
          break

        case 'select':
          color = MapUtils.getSelectColor(value, configs, selected_indicator)
          break

      }

      return {
        weight: 0.0,
        opacity: 1,
        fillOpacity: 1,
        fillColor: color
      }
    }

    function onEachFeature(feature, layer) {
      var closeTooltip
      var popup = new L.Popup({ autoPan: false })

      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: onMapClick
      })

      function mousemove(e) {
        var layer = e.target
        popup.setLatLng(e.latlng)

        var value = 'No data'
        var cname = MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME'])

        if (cname in indicators && indicators[cname][selected_indicator] !== undefined) {
          var tooltipTemplate = configs.indicators[selected_indicator].tooltip

          // gdp with years
          if (configs.indicators[selected_indicator].years) {
            value = indicators[cname][selected_indicator].years[selected_year]
          } else {
            value = indicators[cname][selected_indicator]
          }
        }

        var value = MapUtils.compileTemplate(tooltipTemplate, {currentIndicator: value})

        popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

        if (!popup._map) popup.openOn(map)
        window.clearTimeout(closeTooltip)

        layer.setStyle({
          weight: 3,
          opacity: 0.3,
          fillOpacity: 0.9
        })

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront()
        }
      }

      function mouseout(e) {
        countryLayer.resetStyle(e.target)
        closeTooltip = window.setTimeout(function() {
          map.closePopup()
        }, 100)
      }

      function onMapClick(e) {
        // zoomToFeature
        map.fitBounds(e.target.getBounds())

        // set selected country
        MapActionCreators.changeSelectedCountry(MapUtils.getCountryNameId(e.target.feature.properties['ISO_NAME']))
      }
    }

    // add legend
    // clean up first
    if(!_.isEmpty(this.state.legend)) {
      map.legendControl.removeLegend(this.state.legend)
    }
    var legend = getLegendHTML()
    map.legendControl.addLegend(legend)
    this.setState({legend: legend})

    function getLegendHTML() {
      if (_.isEmpty(self.props.configs) || _.isEmpty(self.props.globals)) return
      var selected_indicator = GLOBALStore.getSelectedIndicator()
      var configs = self.props.configs
      var indicatorName = configs.indicators[selected_indicator].name

      var labels = [], from, to
      var min = globals.meta.indicators[selected_indicator].min_value.toFixed()
      var max = globals.meta.indicators[selected_indicator].max_value.toFixed()
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
        labels.push(`<li><span class='swatch' style='background:${colors[i]}'></span>${from}${'&ndash;'}${to}</li>`)
      }

      return `<span>${indicatorName}</span><ul class='legend-list'>${labels.join('')}</ul>`

    }
  },

  render() {
    return (
      <div className='main'>
        <div className='card map-container'>
          <div id='map'></div>
        </div>
      </div>
    )
  }

})

module.exports = Map
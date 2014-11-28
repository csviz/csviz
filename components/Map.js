'use strict'

var _ = require('lodash')
var React = require('react')
var mapbox = require('mapbox.js')
var numeral = require('numeral')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var createStoreMixin = require('../mixins/createStoreMixin')
var MapUtils = require('../utils/MapUtils')

var config = require('../config.json')
var mapbox_config = config.mapbox

var Map = React.createClass({

  displayName: 'MapComponent',

  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    var selected_country = Store.getSelectedCountry()

    return {
      selected_indicator: selected_indicator,
      selected_year: selected_year,
      selected_country: selected_country
    }
  },

  getInitialState() {
    return {
      map: {},
      countryLayer: null,
      legend: null
    }
  },

  componentDidMount() {
    Store.addCountryChangeListener(this.handleCountryChange)
    Store.addIndicatorChangeListener(this.updateChoropleth)
    Store.addYearChangeListener(this.updateChoropleth)

    this.setState(this.getStateFromStores())

    L.mapbox.accessToken = mapbox_config.token
    var map = L.mapbox.map('map', mapbox_config.type).setView(mapbox_config.location, mapbox_config.zoomlevel)
    this.setState({map: map})
  },

  handleCountryChange() {
    var selected_country = Store.getSelectedCountry()
    if (selected_country && this.state.map && this.state.countryLayer) {
      MapUtils.centerOnCountry(selected_country, this.state.map, this.state.countryLayer)
    }
  },

  updateChoropleth() {
    if (_.isEmpty(this.props.data) || _.isEmpty(this.state.selected_indicator)) return

    var global = this.props.data.global
    var meta = global.meta
    var map = this.state.map
    var configs = this.props.data.configs
    var indicators = global.data.locations
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    // clean up existing layers
    if (this.state.countryLayer && this.state.countryLayer._layers !== undefined) {
      for (var layer_i in this.state.countryLayer._layers) {
        map.removeLayer(this.state.countryLayer._layers[layer_i])
      }
      this.setState({countryLayer: null})
    }

    // add country choropleth
    var countryLayer = L.geoJson(this.props.data.geo.filter((shape) =>
      MapUtils.getCountryNameId(shape.properties['ISO_NAME']) in indicators
    ), {
      style: getStyle,
      onEachFeature: onEachFeature
    }).addTo(map)

    this.setState({countryLayer: countryLayer})

    // get style function
    function getStyle(feature) {
      var value, color
      var countryName = MapUtils.getCountryNameId(feature.properties['ISO_NAME'])

      // make sure country exist
      if (countryName in indicators) value = indicators[countryName][selected_indicator]
      // check if the value has years
      if (configs.indicators[selected_indicator].years.length) value = value.years[selected_year]

      // check the type of the data
      if (configs.indicators[selected_indicator].type == 'number') {
        color = MapUtils.getNumberColor(value, configs, meta, selected_indicator)
      } else {
        color = MapUtils.getSelectColor(value, configs, selected_indicator)
      }

      return { weight: 0.0, opacity: 1, fillOpacity: 1, fillColor: color }
    }

    // on each feature handler
    function onEachFeature(feature, layer) {
      var closeTooltip
      var popup = new L.Popup({ autoPan: false })

      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: onMapClick
      })

      // mouse move handler
      function mousemove(e) {
        var layer = e.target
        popup.setLatLng(e.latlng)

        var value = 'No data'
        var cname = MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME'])

        if (cname in indicators && indicators[cname][selected_indicator] !== undefined) {
          var tooltipTemplate = configs.indicators[selected_indicator].tooltip

          // gdp with years
          if (configs.indicators[selected_indicator].years.length) {
            value = indicators[cname][selected_indicator].years[selected_year].toFixed(2)
            value = numeral(value).format('0,0')
          } else {
            if(indicators[cname][selected_indicator]) {
              value = indicators[cname][selected_indicator].toFixed(2)
              value = numeral(value).format('0,0')
            }
          }
        }

        var value = MapUtils.compileTemplate(tooltipTemplate, {currentIndicator: value})

        popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

        if (!popup._map) popup.openOn(map)
        window.clearTimeout(closeTooltip)

        layer.setStyle({ weight: 3, opacity: 0.3, fillOpacity: 0.9 })

        if (!L.Browser.ie && !L.Browser.opera) layer.bringToFront()
      }

      // on mouse out handler
      function mouseout(e) {
        countryLayer.resetStyle(e.target)
        closeTooltip = window.setTimeout(function() {
          map.closePopup()
        }, 100)
      }

      // on map click handler
      function onMapClick(e) {
        var selectedCountryName = MapUtils.getCountryNameId(e.target.feature.properties['ISO_NAME'])
        MapUtils.centerOnCountry(selectedCountryName, map, countryLayer)
        MapActionCreators.changeSelectedCountry(selectedCountryName)
      }
    }

    // add legend
    // clean up first
    if(!_.isEmpty(this.state.legend)) map.legendControl.removeLegend(this.state.legend)
    var legend = MapUtils.getLegendHTML(configs, global, selected_indicator)
    map.legendControl.addLegend(legend)
    this.setState({legend: legend})
  },

  render() {
    return (
      <div className='main'>
        <div className='map-container'>
          <div id='map'></div>
        </div>
      </div>
    )
  }

})

module.exports = Map
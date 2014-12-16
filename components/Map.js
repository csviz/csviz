'use strict'

var _ = require('lodash')
var React = require('react')
var Router = require('react-router')
var objectAssign = require('object-assign')
var mapbox = require('mapbox.js')
var numeral = require('numeral')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var MapUtils = require('../utils/MapUtils')
var Timeline = require('./Timeline')
var SearchBar = require('./SearchBar')

var config = require('../config.json')
var mapbox_config = config.mapbox

var Map = React.createClass({

  displayName: 'MapComponent',

  mixins: [ Router.State, Router.Navigation ],

  getInitialState() {
    return {
      map: {},
      countryLayer: null,
      legend: null
    }
  },

  componentDidMount() {
    Store.addChangeListener(this.updateChoropleth)
    Store.addCountryChangeListener(this.handleCountryChange)
    Store.addIndicatorChangeListener(this.updateChoropleth)
    Store.addYearChangeListener(this.updateChoropleth)

    L.mapbox.accessToken = mapbox_config.token
    var map = L.mapbox.map('map', mapbox_config.type).setView(mapbox_config.location, mapbox_config.zoomlevel)
    this.setState({map: map})
  },

  handleCountryChange() {
    var selected_country = Store.getSelectedCountry()
    if (selected_country && this.state.map && this.state.countryLayer) {
      this.state.countryLayer.eachLayer(function(layer) {
        if(MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME']) === selected_country) {
          var popup = new L.Popup({ autoPan: false, closeButton: false })
          var indicators = this.props.data.global.data.locations
          var configs = this.props.data.configs
          var selected_indicator = Store.getSelectedIndicator()
          var selected_year = Store.getSelectedYear()

          this.state.map.fitBounds(layer.getBounds())
          MapUtils.centerOnCountry(layer, this.state.map)
          MapUtils.addTooltip(this.state.map, layer, popup, indicators, selected_indicator, configs, selected_year)
        }
      }.bind(this))
    }
  },

  updateChoropleth() {
    var self = this
    var data = Store.getAll()
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    if (_.isEmpty(data) || _.isEmpty(selected_indicator)) return

    var global = data.global
    var meta = global.meta
    var map = this.state.map
    var configs = data.configs
    var indicators = global.data.locations

    // clean up existing layers
    if (this.state.countryLayer && this.state.countryLayer._layers !== undefined) {
      for (var layer_i in this.state.countryLayer._layers) {
        map.removeLayer(this.state.countryLayer._layers[layer_i])
      }
      this.setState({countryLayer: null})
    }

    // get style function
    function getStyle(feature) {
      var value, color
      var countryName = MapUtils.getCountryNameId(feature.properties['ISO_NAME'])

      // make sure country exist
      if (countryName in indicators) value = indicators[countryName][selected_indicator]
      // check if the value has years
      if (value && configs.indicators[selected_indicator].years.length) value = value.years[selected_year]

      if (value) {
        // check the type of the data
        if (configs.indicators[selected_indicator].type == 'number') {
          color = MapUtils.getNumberColor(value, configs, meta, selected_indicator)
        } else {
          color = MapUtils.getSelectColor(value, configs, selected_indicator)
        }

        return {
          weight: 0.5,
          opacity: 0.8,
          color: 'white',
          fillOpacity: 0.8,
          fillColor: color
        }
      } else {
        // for country with no data
        return {
          weight: 0.5,
          opacity: 0.8,
          color: 'white',
          fillOpacity: 0.3
        }
      }

    }

    // on each feature handler
    function onEachFeature(feature, layer) {
      var closeTooltip
      var popup = new L.Popup({ autoPan: false, closeButton: false })

      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: onMapClick
      })

      // mouse move handler
      function mousemove(e) {
        var layer = e.target
        MapUtils.addTooltip(map, layer, popup, indicators, selected_indicator, configs, selected_year, e)
        window.clearTimeout(closeTooltip)
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
        var layer = e.target
        var selectedCountryName = MapUtils.getCountryNameId(e.target.feature.properties['ISO_NAME'])

        self.updateQuery({country: selectedCountryName})

        MapUtils.centerOnCountry(layer, map)
        MapActionCreators.changeSelectedCountry(selectedCountryName)
      }
    }

    // add legend
    // clean up first
    if(!_.isEmpty(this.state.legend)) map.legendControl.removeLegend(this.state.legend)
    var legend = MapUtils.getLegendHTML(configs, global, selected_indicator)
    map.legendControl.addLegend(legend)
    this.setState({legend: legend})

    // add country choropleth
    var countryLayer = L.geoJson(data.geo.filter((shape) =>
      MapUtils.getCountryNameId(shape.properties['ISO_NAME']) in indicators
    ), {
      style: getStyle,
      onEachFeature: onEachFeature
    }).setZIndex(1).addTo(map)

    var labelLayer = L.mapbox.tileLayer(mapbox_config.label).addTo(map)
    labelLayer.setZIndex(2)
    // if (!L.Browser.ie && !L.Browser.opera) labelLayer.bringToFront()
    // map.addLayer(mapbox.layer().id(mapbox_config.label))
    // map.addLayer(mapbox.layer().id(mapbox_config.label))

    this.setState({countryLayer: countryLayer})
  },

  updateQuery(data) {
    var queries = this.getQuery()
    var _queries = objectAssign(queries, data)
    this.replaceWith('app', {}, _queries)
  },

  render() {
    return (
      <section id='main'>
        <div id='map'></div>
        <SearchBar data={this.props.data} />
        <Timeline data={this.props.data} />
      </section>
    )
  }

})

module.exports = Map
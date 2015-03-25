'use strict'

var _ = require('lodash')
var React = require('react')
var Router = require('react-router')
var mapbox = require('mapbox.js')
var numeral = require('numeral')
var marked = require('marked')
var mui = require('material-ui')
var Dialog = mui.Dialog
var Icon = mui.Icon

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var MapUtils = require('../utils/MapUtils')
var Timeline = require('./Timeline')
var SearchBar = require('./SearchBar')
var queryMixin = require('../mixins/queryMixin')

var config = require('../config.json')
var mapbox_config = config.mapbox

var Map = React.createClass({

  displayName: 'MapComponent',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  getInitialState() {
    return {
      map: null,
      countryLayer: null,
      legend: null,
      controlLayer: null
    }
  },

  componentDidMount() {
    Store.addChangeListener(this.updateChoropleth)
    Store.addCountryChangeListener(this.handleCountryChange)
    Store.addIndicatorChangeListener(this.updateChoropleth)
    Store.addYearChangeListener(this.handleYearChange)
    Store.addLegendChangeListener(this.toggleLegend)

    L.mapbox.accessToken = mapbox_config.token

    var map = L.mapbox.map('map', mapbox_config.type, {
      maxZoom: 4,
      trackResize: true
    }).setView(mapbox_config.location, mapbox_config.zoomlevel)

    this.setState({map: map})
  },

  handleYearChange() {
    this.updateChoropleth()
    var data = Store.getAll()
    var global = data.global
    var meta = global.meta
    var selected_country = Store.getSelectedCountry()

    if (selected_country && this.state.map && this.state.countryLayer) {
      this.state.countryLayer.eachLayer((layer) => {
        if(MapUtils.getCountryNameFromMetaByISO(layer.feature.properties['ISO'], meta) === selected_country) {
          var popup = new L.Popup({ autoPan: false, closeButton: false })
          var indicators = this.props.data.global.data.locations
          var configs = this.props.data.configs
          var global = this.props.data.global
          var selected_indicator = Store.getSelectedIndicator()
          var selected_year = Store.getSelectedYear()

          if (selected_indicator !== 'map_of_the_global_partnership_for_education') {
            MapUtils.addTooltip(this.state.map, layer, popup, global, selected_indicator, configs, selected_year)
          }
        }
      })
    }
  },

  handleCountryChange() {
    var data = Store.getAll()
    var global = data.global
    var meta = global.meta
    var selected_country = Store.getSelectedCountry()

    if (selected_country === '') {
      this.state.map.closePopup()
      this.state.map.setView(mapbox_config.location, mapbox_config.zoomlevel)
    } else if (selected_country && this.state.map && this.state.countryLayer) {
      this.state.countryLayer.eachLayer((layer) => {
        if(MapUtils.getCountryNameFromMetaByISO(layer.feature.properties['ISO'], meta) === selected_country) {
          var popup = new L.Popup({ autoPan: false, closeButton: false })
          var indicators = this.props.data.global.data.locations
          var configs = this.props.data.configs
          var global = this.props.data.global
          var selected_indicator = Store.getSelectedIndicator()
          var selected_year = Store.getSelectedYear()

          var center = layer.getBounds().getCenter()

          this.state.map.panTo(center)
          if (selected_indicator !== 'map_of_the_global_partnership_for_education') {
            MapUtils.addTooltip(this.state.map, layer, popup, global, selected_indicator, configs, selected_year)
          }
        }
      })
    }
  },

  updateChoropleth() {
    var self = this
    var map = this.state.map
    var data = Store.getAll()
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    var filteredCountry

    // return there's no data
    if (_.isEmpty(data) || _.isEmpty(selected_indicator)) return

    // clean up existing layers
    if (map.hasLayer(this.state.countryLayer)) {
      this.state.countryLayer.clearLayers()
      this.state.countryLayer.clearAllEventListeners()
      map.removeLayer(this.state.countryLayer)
      this.setState({countryLayer: null})
    }
    // clean up legend
    this.cleanLegend()
    // only show legend for desktop
    if (window.innerWidth > 768) { this.addLegend() }

    var global = data.global
    var meta = global.meta
    var configs = data.configs
    var indicators = global.data.locations

    // get style function
    function getStyle(feature) {
      var value, color
      // var countryName = MapUtils.getCountryNameId(feature.properties['ISO_NAME'])
      var countryName = MapUtils.getCountryNameFromMetaByISO(feature.properties['ISO'], meta)

      // make sure country exist
      if (countryName in indicators) value = indicators[countryName][selected_indicator]

      // check if the value has years
      if (value && configs.indicators[selected_indicator].years.length) value = value.years[selected_year]

      if (!_.isUndefined(value) && !_.isNull(value)) {
        // check the type of the data
        if (configs.indicators[selected_indicator].type == 'number') {
          color = MapUtils.getNumberColor(value, configs, meta, selected_indicator)
        } else if (configs.indicators[selected_indicator].type == 'boolean') {
          color = MapUtils.getSelectColor(value, configs, selected_indicator)
        }

        return  {
          weight: 0.5,
          opacity: 0.8,
          color: 'white',
          fillOpacity: 0.65,
          fillColor: color
        }
      } else {
        // for country with no data
        return {
          weight: 0.5,
          opacity: 0.8,
          fillOpacity: 0.65,
          color: 'white',
          fillColor: '#eeeeee'
        }
      }
    }

    // get style function
    function getFragileStyle(feature) {
      return {
        weight: 1,
        opacity: 0.8,
        color: 'rgba(0, 0, 0, 0)',
        fillOpacity: 0.65,
        fillColor: 'rgba(0, 0, 0, 0)'
      }
    }

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

        if (selected_indicator !== 'map_of_the_global_partnership_for_education') {
          MapUtils.addTooltip(map, layer, popup, global, selected_indicator, configs, selected_year, e)
        }

        window.clearTimeout(closeTooltip)
        layer.setStyle({
          fillOpacity: 1
        })
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront()
        }
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
        var selectedCountryName = MapUtils.getCountryNameFromMetaByISO(e.target.feature.properties['ISO'], meta)
        // var selectedCountryName = MapUtils.getCountryNameId(e.target.feature.properties['ISO_NAME'])
        self.updateQuery({country: selectedCountryName})
        map.panTo(e.latlng)
        MapActionCreators.changeSelectedCountry(selectedCountryName)
      }
    }

    function onEachFragileFeature(feature, layer) {
      setTimeout(function() {
        // var countryName = MapUtils.getCountryNameId(layer.feature.properties['ISO_NAME'])
        var countryName = MapUtils.getCountryNameFromMetaByISO(layer.feature.properties['ISO'], meta)
        if(layer._container && meta.locations[countryName].fragile) {
          layer._container.children[0].style.fill = 'url(#fragilePattern)'
        }
      }, 0)
    }

    // gpe specify stuff..
    if (selected_indicator != 'map_of_the_global_partnership_for_education') {
      filteredCountry = data.geo.filter((shape) => {
        var countryName = MapUtils.getCountryNameFromMetaByISO(shape.properties['ISO'], meta)
        return countryName in indicators && (indicators[countryName] && indicators[countryName]['map_of_the_global_partnership_for_education'] != 1)
      })
    } else {
      filteredCountry = data.geo.filter((shape) => {
        var countryName = MapUtils.getCountryNameFromMetaByISO(shape.properties['ISO'], meta)
        return countryName in indicators
      })
    }

    var countryLayer = L.geoJson(filteredCountry, {
      style: getStyle,
      onEachFeature: onEachFeature
    })
    countryLayer.addTo(map)

    this.setState({countryLayer: countryLayer})

    // fragile layer and controll layer should be reused, country layer update all the time
    if (_.isUndefined(this.state.fragileCountryLayer)) {
      var fragileCountryLayer = L.geoJson(filteredCountry, {
        style: getFragileStyle,
        onEachFeature: onEachFragileFeature
      }).addTo(map)
      this.setState({ fragileCountryLayer: fragileCountryLayer })
    }

    if (!this.state.controlLayer) {
      var controlLayer = L.control.layers(null, {
        'Fragile States': fragileCountryLayer,
        'Country Label': L.mapbox.tileLayer(mapbox_config.label)
      }, {
        position: 'topleft',
        autoZIndex: 'true'
      }).addTo(map)
      this.setState({controlLayer: controlLayer})
    }

    map.on('overlayremove', function(e) {
      if (e.name === 'Fragile States') {
        var fragileContainer = document.querySelector('.fragile-container')
        self.addClass(fragileContainer, 'hide')
      }
    })

    map.on('overlayadd', function(e) {
      if (e.name === 'Fragile States') {
        var fragileContainer = document.querySelector('.fragile-container')
        self.removeClass(fragileContainer, 'hide')
      }
    })

  },

  _showDialog() {
    this.refs.aboutDialog.show()
  },

  render() {
    var about = ''
    var dialogActions = [
      { text: '×' }
    ]

    var data = Store.getAll()
    if (data && data.configs) {
      about = data.configs.site.about || 'No Description yet, please go to [CSViz](http://csviz.org) to update your description.'
    }

    return (
      <section id='main'>
        <div className='sidebar-toggle'>
          <button name='button' onClick={this.toggleSidebar}></button>
        </div>
        <div id='map'></div>
        <Timeline data={this.props.data} />
        <SearchBar data={this.props.data} />
        <div className='about' onClick={this._showDialog}>
          <Icon icon='action-info' />
        </div>
        <Dialog className='about-dialog-box' ref='aboutDialog' title='About' actions={dialogActions}>
          <div className="about-dialog-box-title"
            dangerouslySetInnerHTML={{
              __html: marked(about)
            }}
          />
        </Dialog>
      </section>
    )
  },

  hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className)
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
    }
  },

  toggleSidebar() {
    var body = document.querySelector('body')
    if(this.hasClass(body, 'isSidebarOpen')) {
      this.removeClass(body, 'isSidebarOpen')
    } else {
      this.addClass(body, 'isSidebarOpen')
    }
    setTimeout(() => {
      if(this.state.map) this.state.map._onResize()
    }, 100)
  },

  addClass(el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      el.className += ' ' + className
    }
  },

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
  },

  addLegend() {
    var data = Store.getAll()
    var global = data.global
    var configs = data.configs
    var selected_indicator = Store.getSelectedIndicator()
    var legend = MapUtils.getLegendHTML(configs, global, selected_indicator)
    this.state.map.legendControl.addLegend(legend)
    this.setState({legend: legend})
  },

  cleanLegend() {
    if(this.state.map && !_.isEmpty(this.state.legend)) this.state.map.legendControl.removeLegend(this.state.legend)
    this.setState({legend: null})
  },

  toggleLegend() {
    var currentLegendStatus = Store.getLegendStatus()

    if (currentLegendStatus){
      this.cleanLegend()
      this.addLegend()
    } else {
      this.cleanLegend()
    }
  }

})

module.exports = Map

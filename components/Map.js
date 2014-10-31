/**
 * @jsx React.DOM
 */

var React = require('react')
var mapbox = require('mapbox.js')
var MapUtils = require('../utils/MapUtils')

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
      map: {}
    }
  },

  componentDidMount() {
    L.mapbox.accessToken = mapbox_config.token
    var map = L.mapbox.map('map', mapbox_config.type).setView(mapbox_config.location, mapbox_config.zoomlevel)
    this.setState({map: map})
  },

  componentWillReceiveProps: function(nextProps) {
    this.updateChoropleth()
  },

  updateChoropleth() {
    var map = this.state.map

    var dataByCountry = this.props.globals.data.locations

    // function getRanges(dataByCountry)

    var countryLayer = L.geoJson(this.props.geo, {
      style: MapUtils.getStyle,
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
/**
 * @jsx React.DOM
 */

var React = require('react')
var mapbox = require('mapbox.js')

var config =  {
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
    L.mapbox.accessToken = config.token
    var map = L.mapbox.map('map', config.type).setView(config.location, config.zoomlevel)
    this.setState({map: map})
  },

  updateChoropleth() {
    var map = this.state.map

    // clean existing layer
    if (map && map.choropleth) {
      map.choropleth._layers.forEach(function(layer) {
        map.removeLayer(layer)
      })
    }
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
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

  getInitialState: function() {
    return {
      map: {}
    };
  },

  componentDidMount: function() {
    L.mapbox.accessToken = config.token
    var map = L.mapbox.map('map', config.type).setView(config.location, config.zoomlevel)
    this.setState({map: map})
  },

  render: function() {
    return (
      <div className='main'>
        <div id='map'></div>
      </div>
    );
  }

});

module.exports = Map;
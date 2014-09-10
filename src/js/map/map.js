/** @jsx React.DOM */
'use strict';

var React = require('react')
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var mapbox = require('mapbox.js')

var csv = './sample.data.csv';
var geo = './countries.geo.json';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      csv_data: [],
      geo_data: [],
      map: {}
    };
  },
  componentWillMount: function() {
    var self = this;
    xhr({ responseType: 'arraybuffer', url: csv}, csv_response)
    xhr({ responseType: 'json', url: geo}, geo_response)

    function geo_response(err, resp, data) {
      self.setState({geo_data: data.features})
    }

    function csv_response(err, resp, data) {
      if (err) throw err
      var buff = new Buffer(new Uint8Array(data))
      var parser = bcsv({json: true})
      parser.pipe(concat(render))
      parser.write(buff)
      parser.end()
    }

    function render(rows) {
      self.setState({csv_data: rows})
    }
  },
  componentDidMount: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhc2VyeHUiLCJhIjoiZ2toZEJhayJ9.im7zAkjGosi1fFKB3PYD2Q'
    var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([42, 9.56], 4)
    this.setState({map: map})
  },
  componentWillUpdate: function(nextProps, nextState) {
    console.log('nextState', nextState)
    if (nextState.csv_data.length >0 && nextState.geo_data.length >0){
      console.log('setting up map');
    }
  },
  render: function() {
    return (
      <div>
        <div id='map'></div>
      </div>
    );
  }
});

/** @jsx React.DOM */
'use strict';

var React = require('react')
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var mapbox = require('mapbox.js')

var csv = 'sample.data.csv';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentWillMount: function() {
    var self = this;
    xhr({ responseType: 'arraybuffer', url: 'http://localhost:8000/' + csv }, response)

    function response(err, resp, data) {
      if (err) throw err
      var buff = new Buffer(new Uint8Array(data))
      var parser = bcsv({json: true})
      parser.pipe(concat(render))
      parser.write(buff)
      parser.end()
    }

    function render(rows) {
      self.setState({data: rows})
    }
  },
  componentDidMount: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhc2VyeHUiLCJhIjoiZ2toZEJhayJ9.im7zAkjGosi1fFKB3PYD2Q'
    var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([42, 9.56], 4);
  },
  render: function() {
    return (
      <div id='map'></div>
    );
  }
});
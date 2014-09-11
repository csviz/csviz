/** @jsx React.DOM */
'use strict';

var React = require('react')
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var mapbox = require('mapbox.js')


var csv = './data/sample.data.csv';
var geo = './data/countries.geo.json';
var colorCount = 6;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      csv_data: {},
      geo_data: [],
      map: {},
      indicator: 'Indicator'
    };
  },
  componentWillMount: function() {
    var self = this;
    xhr({ responseType: 'arraybuffer', url: csv}, csv_response)
    xhr({ responseType: 'json', url: geo}, geo_response)

    /**
     * save geo response
     * @param  {Object} err  err Object
     * @param  {Object} resp response
     * @param  {Object} data data
     */
    function geo_response(err, resp, data) {
      self.setState({geo_data: data.features})
    }

    /**
     * save csv response
     * @param  {Object} err  err
     * @param  {Object} resp response
     * @param  {Object} data data
     */
    function csv_response(err, resp, data) {
      if (err) throw err
      var buff = new Buffer(new Uint8Array(data))
      var parser = bcsv({json: true})
      parser.pipe(concat(_render))
      parser.write(buff)
      parser.end()
    }

    function _render(rows) {
      var dataByCountry = {};
      rows.forEach(function(row) {
        var countryName = row['Country']
        dataByCountry[countryName] = row
        Object.keys(dataByCountry[countryName]).forEach(function(indicatorName) {
          if (indicatorName.toLowerCase() != 'country'){
            dataByCountry[countryName][indicatorName] = Number(dataByCountry[countryName][indicatorName]);
          }
        })
      })
      self.setState({csv_data: dataByCountry});
    }
  },

  /**
   * load map box instance
   * and mount to state
   */
  componentDidMount: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhc2VyeHUiLCJhIjoiZ2toZEJhayJ9.im7zAkjGosi1fFKB3PYD2Q'
    var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([42, 9.56], 4)
    this.setState({map: map})
  },
  componentWillUpdate: function(nextProps, nextState) {

    /**
     * get color from range
     * @param  {Number} value color value
     * @return {String}       color code
     */
    function getColor(value){
      if (!value) return 'rgba(0,0,0,.0)';
      if (value >= nextState.ranges.ranges[5]) return '#5B79AD';
      if (value >= nextState.ranges.ranges[4]) return '#6884B3';
      if (value >= nextState.ranges.ranges[3]) return '#6B87B4';
      if (value >= nextState.ranges.ranges[2]) return '#819BC3';
      if (value >= nextState.ranges.ranges[1]) return '#94AACB';
      if (value >= nextState.ranges.ranges[0]) return '#A7BAD2';
    }

    /**
     * get style from feature
     * @param  {Object} feature object
     * @return {Object} style object
     */
    function getStyle(feature){
      var valuez;
      var countryName = feature.properties.name;
      if (nextState.csv_data[countryName] && nextState.csv_data[countryName][nextState.indicator]){
          valuez = nextState.csv_data[countryName][nextState.indicator];
      }
      var col = getColor(valuez);
      return {
          weight: 1.2,
          opacity: 1,
          fillOpacity: 1,
          fillColor: col
      }
    };

    function onEachFeature(feature){
      //console.log(feature.properties.name);
    };

    /**
     * get ranges from data and indicator
     * @param  {Object} data      data
     * @param  {String} indicator string
     * @return {Object}           ranges object
     */
    function getRanges(data, indicator){
      var values = Object.keys(data).map(function(row) {
        if (data[row][indicator]) return data[row][indicator]
      })

      var max = Math.max.apply(Math, values)
      var min = Math.min.apply(Math, values)

      var rangePoints = [];
      var step = (max - min)/colorCount;
      for (var i = 0; i < colorCount; i++){
        rangePoints.push(min + i*step);
      }

      return {min: min, max: max, ranges: rangePoints};
    }

    /**
     * Make sure we have the data to add to the map
     */
    if (Object.keys(nextState.csv_data).length >0 && nextState.geo_data.length >0){
      var ranges = getRanges(nextState.csv_data, nextState.indicator);
      nextState.ranges = ranges;

      var featuresLayer = L.geoJson(nextState.geo_data, {
        style: getStyle,
        onEachFeature: onEachFeature
      }).addTo(nextState.map);
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

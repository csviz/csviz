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
var colorCount = 6;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      csv_data: {},
      geo_data: [],
      map: {}
    };
  },
  componentWillMount: function() {
    var self = this;

    self.setState({indicator: 'Indicator'})
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
      var dataByCountry = {};
      for (var row_i in rows){
          var countryName = rows[row_i]['Country'];
          dataByCountry[countryName] = rows[row_i];
          for (var indicatorName in Object.keys(dataByCountry[countryName])){
              if (indicatorName.toLowerCase() != 'country'){
                  dataByCountry[countryName][indicatorName] = Number(dataByCountry[countryName][indicatorName]);
              }
          }
      }
      self.setState({csv_data: dataByCountry});
    }
  },
  componentDidMount: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhc2VyeHUiLCJhIjoiZ2toZEJhayJ9.im7zAkjGosi1fFKB3PYD2Q'
    var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([42, 9.56], 4)
    this.setState({map: map})
  },
  componentWillUpdate: function(nextProps, nextState) {
    var getColor = function(value){
        if (!value) return 'rgba(0,0,0,.05)';
        if (value >= nextState.ranges.ranges[5]) return '#5B79AD';
        if (value >= nextState.ranges.ranges[4]) return '#6884B3';
        if (value >= nextState.ranges.ranges[3]) return '#6B87B4';
        if (value >= nextState.ranges.ranges[2]) return '#819BC3';
        if (value >= nextState.ranges.ranges[1]) return '#94AACB';
        if (value >= nextState.ranges.ranges[0]) return '#A7BAD2';
    }

    var getStyle = function(feature){
        var valuez;
        var countryName = feature.properties.name;
        // console.log('feature', feature, nextState.feature);
        if (nextState.csv_data[countryName] && nextState.csv_data[countryName][nextState.indicator]){
            console.log('set', nextState.csv_data[countryName][nextState.indicator])
            valuez = nextState.csv_data[countryName][nextState.indicator];
            console.log('set', valuez, nextState.csv_data[countryName][nextState.indicator])
        }
        var col = getColor(valuez);
        console.log('color is', col, valuez);
        return {
            weight: 1.2,
            opacity: 1,
            fillOpacity: 1,
            fillColor: col
        }
    };

    var onEachFeature = function(feature){
      //console.log(feature.properties.name);
    };
    
    var getRanges = function(data, indicator){
        debugger;
        var values = [];
        for (var i in data){
            console.log(data[i])
            if (data[i][indicator]){
                values.push(data[i][indicator]);
            }
        }

        var max = Math.max.apply(Math, values)
        var min = Math.min.apply(Math, values)

        var rangePoints = [];
        var step = (max - min)/colorCount;
        for (var i = 0; i < colorCount; i++){
          rangePoints.push(min + i*step);
        }

        return {min: min, max: max, ranges: rangePoints};
    }

    console.log('nextState', nextState)
    
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

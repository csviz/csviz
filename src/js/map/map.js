/** @jsx React.DOM */
'use strict';

var React = require('react')
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var mapbox = require('mapbox.js')

// configs
var config = require('../../../config.json');
var csv = config.csv;
var geo = config.geo;
var mapbox_token = config.mapbox.token;
var mapbox_type = config.mapbox.type;
var map_location = config.mapbox.location;
var map_zoomlevel = config.mapbox.zoomlevel;

var COLOR_COUNT = 6;

module.exports = React.createClass({
  displayName: 'MapComponent',

  getInitialState: function() {
    return {
      csv_data: {},
      geo_data: [],
      data_lookup: {},
      layer_lookup: {},
      map: {},
      indicator: 'Youth literacy rate',
      indicatorList: []
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
      self.setState({geo_data: topojson.feature(data, data.objects['Aqueduct_country']).features})
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
      var parser = bcsv({json: true, separator: ';'})
      parser.pipe(concat(_render))
      parser.write(buff)
      parser.end()
    }

    function _render(rows) {
      var dataByCountry = {};
      var indicators = [];
      var dataLookup = {};
      rows.forEach(function(row) {
        var countryName = row['Location'].toLowerCase();
        dataByCountry[countryName] = row
        Object.keys(dataByCountry[countryName]).forEach(function(indicatorName) {
          if (indicatorName.toLowerCase() != 'location'){
            if (indicators.indexOf(indicatorName) == -1){
              indicators.push(indicatorName);
            }
            dataByCountry[countryName][indicatorName] = Number(dataByCountry[countryName][indicatorName]);
          }
        })
      })
      self.setState({
        indicatorList: indicators,
        csv_data: dataByCountry
      });
    }
  },

  /**
   * load map box instance
   * and mount to state
   */
  componentDidMount: function() {
    L.mapbox.accessToken = mapbox_token
    var map = L.mapbox.map('map', mapbox_type).setView(map_location, map_zoomlevel)
    this.setState({map: map})
  },

  componentWillUpdate: function(nextProps, nextState) {
    // Make sure we have the data to add to the map
    this.updateChoropleth(nextState.csv_data, nextState.geo_data, nextState.indicator, nextState.map);
  },

  updateChoropleth: function(data, shapes, indicator, map){
    var self = this;
    // Remove existing layer
    if (map.choropleth){
      for (var layer_i in map.choropleth._layers)
          map.removeLayer(map.choropleth._layers[layer_i]);
    }

    /**
     * get ranges from data and indicator
     * @param  {Object} data      data
     * @param  {String} indicator string
     * @return {Object}           ranges object
     */
    function getRanges(data, indicator){
      var values = Object.keys(data).map(function(row) {
        if (data[row][indicator]) return data[row][indicator];
      })
      values = values.filter(function(val){
        if (val !== undefined && '' + Number(val) !== 'NaN') return true;
      });

      var max = Math.max.apply(Math, values)
      var min = Math.min.apply(Math, values)

      var rangePoints = [];
      var step = (max - min)/COLOR_COUNT;
      for (var i = 0; i < COLOR_COUNT; i++){
        rangePoints.push(min + i*step);
      }
      return {min: min, max: max, ranges: rangePoints};
    }

    /**
     * get color from range
     * @param  {Number} value color value
     * @return {String}       color code
     */
    function getColor(value, ranges){
      if (!value) return 'rgba(0,0,0,.0)';
      if (value >= ranges.ranges[5]) return '#5B79AD';
      if (value >= ranges.ranges[4]) return '#6884B3';
      if (value >= ranges.ranges[3]) return '#6B87B4';
      if (value >= ranges.ranges[2]) return '#819BC3';
      if (value >= ranges.ranges[1]) return '#94AACB';
      if (value >= ranges.ranges[0]) return '#A7BAD2';
    }

    var ranges = getRanges(data, indicator);

    /**
     * get style from feature
     * @param  {Object} feature object
     * @return {Object} style object
     */
    function getStyle(feature){
      var value;
      var countryName = feature.properties['ISO_NAME'];

      if (countryName){
        if (countryName.toLowerCase() in data){
            value = data[countryName.toLowerCase()][indicator];
        }
      } else {
        console.log('No name', feature);
      }

      var col = getColor(value, ranges);
      return {
          weight: 0.0,
          opacity: 1,
          fillOpacity: 1,
          fillColor: col
      }
    };

    function onEachFeature(feature, layer){
      var closeTooltip;
      self.tooltipClosing = false;
      var popup = new L.Popup({ autoPan: false });

      layer.on({
          mousemove: mousemove,
          mouseout: mouseout
      });

      function mousemove(e) {
        self.tooltipClosing = false;
        var layer = e.target;
        //popup.setLatLng(e.latlng);
        popup.setLatLng(layer.getBounds().getCenter());  // Center of region

        var value = 'No data';
        var cname = layer.feature.properties['ISO_NAME'].toLowerCase();
        if (cname in data && data[cname][self.state.indicator] !== undefined){
            value = data[cname][self.state.indicator];
        }

        popup.setContent('<div class="marker-title">' + layer.feature.properties['ISO_NAME'] + '</div>' + value)

        if (!popup._map) popup.openOn(map);
        window.clearTimeout(closeTooltip);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
      }

      function mouseout(e) {
        self.tooltipClosing = true;
        closeTooltip = window.setTimeout(function() {
          if (self.tooltipClosing){
            map.closePopup();
          }

        }, 1000);
      }
    };
    if (Object.keys(data).length >0 && shapes.length >0){
      var filteredShapes = shapes.filter(function(shape){
        if (shape.properties['ISO_NAME'].toLowerCase() in data) return true;
      })
      map.choropleth = L.geoJson(filteredShapes, {
        style: getStyle,
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  },

  onSelectChange: function(e) {
    var el = e.target
    var name = el.name

    this.setState({indicator: el.value});
    this.updateChoropleth(this.state.csv_data, this.state.geo_data, this.state.indicator, this.state.map);
  },

  render: function() {
    var options = this.state.indicatorList.map(function(indicator, i) {
      return <option key={i} value={indicator}>{indicator}</option>
    })
    return (
      <section id='main'>
        <div className='indicator'>
          <form className='indicatorSeletor select'>
            <select name="indicator" onChange={this.onSelectChange}>
              {options}
            </select>
          </form>
        </div>

        <div id='map'></div>
      </section>
    );
  }
});

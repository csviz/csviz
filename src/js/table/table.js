/** @jsx React.DOM */
'use strict';

var React = require('react');
var bcsv = require('binary-csv')
var xhr = require('xhr')
// var bops = require('bops')
// var through = require('through')
// var url = require('url')
// var createTable = require('data-table')
// var insertCSS = require('insert-css')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer

// insertCSS(createTable.css)

// var parsedURL = url.parse(window.location.href, true)
// var csv = parsedURL.query.csv || 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv'
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
      // console.log('rows', rows)
      // var table = createTable(rows)
      // table.appendTo(document.getElementById('table'))
    }
  },
  render: function() {
    var rows = this.state.data.map(function (data, i) {
      return <tr key={i}><td>{data.Country}</td><td>{data.Indicator}</td></tr>;
    });
    return (
      <table>
        <thead>
          <tr><th>Country</th><th>Indicator</th></tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>

    );
  }
});
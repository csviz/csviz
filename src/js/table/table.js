/** @jsx React.DOM */
'use strict';

var React = require('react');
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var helper = require('./handsontable.csv.js')
var Github = require('github-api')
var user = require('../models/user')

var csv = './data/sample.data.csv';

module.exports = React.createClass({
  displayName: 'TableComponent',

  getInitialState: function() {
    return {
      csv_data: [],
      editing: false,
      table: {}
    };
  },

  componentWillMount: function() {
    xhr({ responseType: 'arraybuffer', url: csv}, csv_response.bind(this))

    function csv_response(err, resp, data) {
      if (err) throw err
      var buff = new Buffer(new Uint8Array(data))
      var parser = bcsv({json: true})
      parser.pipe(concat(render.bind(this)))
      parser.write(buff)
      parser.end()
    }

    function render(rows) {
      this.setState({csv_data: rows})
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.csv_data.length) {
      var $container = $('#handsontable')
      var colHeaders = helper.makeHeader(nextState.csv_data)
      $container.handsontable({
        data: nextState.csv_data,
        colHeaders: colHeaders,
        columns: helper.makeColumns(colHeaders),
        minSpareRows: 5
      });
    }
  },

  // make table
  componentDidUpdate: function(prevProps, prevState) {
    if(prevState.table && Object.keys(prevState.table).length === 0) {
      var table = $("#handsontable").handsontable('getInstance');
      this.setState({table: table})
    }
  },

  render: function() {
    return (
      <div className="container">
        <div id='handsontable'></div>
      </div>
    );
  }
});

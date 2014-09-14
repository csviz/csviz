/** @jsx React.DOM */
'use strict';

var React = require('react');
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer
var helper = require('./handsontable.csv.js')
var Github = require('github-api')
var auth = require('../routes/auth')
var user = require('../models/user')

var csv = './data/sample.data.csv';

module.exports = React.createClass({
  displayName: 'TableComponent',

  mixins: [auth],

  getInitialState: function() {
    return {
      csv_data: [],
      editing: false,
      instance: {},
      loggedIn: !!localStorage.token
    };
  },
  componentWillMount: function() {
    var self = this;
    xhr({ responseType: 'arraybuffer', url: csv}, csv_response)

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

  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.csv_data) {
      var $container = $('#handsontable')
      var colHeaders = helper.makeHeader(nextState.csv_data)
      $container.handsontable({
        data: nextState.csv_data,
        colHeaders: colHeaders,
        columns: helper.makeColumns(colHeaders),
        minSpareRows: 1
      });
    }
  },

  // make instance
  componentDidUpdate: function(prevProps, prevState) {
    if(Object.keys(prevState.instance).length === 0) {
      var instance = $("#handsontable").handsontable('getInstance');
      this.setState({instance: instance})
    }
  },

  edit: function(e) {
    var self = this;
    this.setState({editing: true})
  },
  cancel: function(e) {
    console.log('on cancel')
    this.setState({editing: false})
  },
  save: function(e) {
    this.setState({editing: false})
    var editedData = helper.string(this.state.instance)

    var github = new Github({
      token: user.attrs.github.accessToken,
      auth: 'oauth'
    });

    this.setState({github: github})

    var repo = github.getRepo(user.attrs.github.login, 'csviz')
    // need to define the path of the data
    repo.write('master', 'test.csv', editedData, 'Update CSV file from CSViz.', function(err) {
      console.log('err', err)
      console.log('write data success')
    });

  },
  render: function() {
    return (
      <div className="container">
        <div className="controls">
          <button onClick={this.save}>Save</button>
          <a href="http://csviz.dev.wiredcraft.com/token">Edit</a>
        </div>
        <div id='handsontable'></div>
      </div>

    );
  }
});

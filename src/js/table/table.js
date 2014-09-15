/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;
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
      loggedIn: false,
      loading: false
    };
  },

  setStateOnAuth: function(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  },

  componentWillMount: function() {
    // check login
    if (!!window.localStorage.token) {
      this.setStateOnAuth(true)
    } else {
      this.setStateOnAuth(false)
    }

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

  save: function(e) {
    this.setState({loading: true})
    var table = $("#handsontable").handsontable('getInstance')
    var editedData = helper.string(table)

    var github = new Github({
      token: user.attrs.github.accessToken,
      auth: 'oauth'
    });

    var repo = github.getRepo(user.attrs.github.login, 'csviz')

    // need to define the path of the data
    repo.write('master', 'data/sample.data.csv', editedData, 'Update CSV file from CSViz.', function(err) {
      if(err) console.log('err', err)
      console.log('write data success')
      this.setState({loading: false})
    }.bind(this));

  },
  render: function() {
    var classes = cx({
      'container': true,
      'loading': this.state.loading
    })
    var loading = this.state.loading ?
      <span>saving...</span> :
      <span></span>;
    return (
      <div className={classes}>
        <div id='handsontable'></div>
        <div className="footer">
          <button onClick={this.save}>Save</button>
          {loading}
        </div>
      </div>
    );
  }
});

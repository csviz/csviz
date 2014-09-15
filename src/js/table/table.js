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

// TODO: read from config
var csv = './data/sample.data.csv';
var csv_path = 'data/sample.data.csv';
var commit_message = 'Update CSV file from CSViz.';

module.exports = React.createClass({
  displayName: 'TableComponent',

  getInitialState: function() {
    return {
      csv_data: [],
      loading: false
    };
  },

  componentWillMount: function() {
    // load csv data
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

  // init the handsontable element
  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.csv_data.length) {
      var $container = $('#handsontable')
      var colHeaders = helper.makeHeader(nextState.csv_data)
      $container.handsontable({
        data: nextState.csv_data,
        columns: helper.makeColumns(colHeaders),
        minSpareRows: 5,
        minSpareCols: 1
      });
    }
  },

  // save changes to github
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
    repo.write('master', csv_path, editedData, commit_message, function(err) {
      if(err) console.log('err', err)
      console.log('write data success')
      this.setState({loading: false})
    }.bind(this));
  },

  render: function() {
    var disabled = this.state.loading || !this.props.loggedIn
    var loading = this.state.loading ?
      <span>saving...</span> :
      <span></span>;
    var classes = cx({
      'container': true,
      'loading': this.state.loading
    })

    return (
      <div className={classes}>
        <div id='handsontable'></div>
        <div className="footer">
          <button onClick={this.save} disabled={disabled}>Save</button>
          {loading}
        </div>
      </div>
    );
  }
});

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
var Message = require('../models/message')

var config = require('../../../config.json');
var csv = config.csv;
var csv_path = config.git.csv_path;
var commit_message = config.git.commit_message;

// trim the last spare rows
var SPAREROWS = 5;

module.exports = React.createClass({
  displayName: 'TableComponent',

  getInitialState: function() {
    return {
      csv_data: [],
      loading: false,
      msg: {
        type: null,
        message: ''
      }
    };
  },

  componentWillMount: function() {
    // load csv data
    xhr({ responseType: 'arraybuffer', url: csv, timeout: 100 * 1000}, csv_response.bind(this))
    function csv_response(err, resp, data) {
      if (err) throw err
      var buff = new Buffer(new Uint8Array(data))
      var parser = bcsv({json: true, separator: ';'})
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
        colHeaders: colHeaders,
        minSpareRows: SPAREROWS || 5,
        minSpareCols: 3
      });
    }
  },

  componentWillUnmount: function() {
    this.setState({msg: {
      type: null,
      message: ''
    }})
  },

  // save changes to github
  save: function(e) {
    this.setState({loading: true})
    var table = $("#handsontable").handsontable('getInstance')
    var editedData = helper.string(table, SPAREROWS)

    var github = new Github({
      token: user.attrs.github.accessToken,
      auth: 'oauth'
    });

    var repo = github.getRepo(user.attrs.github.login, this.props.meta.repo || 'csviz')

    // need to define the path of the data
    repo.write('master', csv_path, editedData, commit_message, function(err) {
      this.setState({loading: false})
      if(err) {
        return this.setState({msg: {
          tpye: 'error',
          message: 'Save data to github error, make sure you have the right permission.'
        }})
      }
      this.setState({msg: {
        type: 'success',
        message: 'Save data to github successful, your page will be available shortly.'
      }})
      setTimeout(function() {
        this.setState({msg: {
          type: null,
          message: ''
        }})
      }.bind(this), 5000)
    }.bind(this));
  },

  render: function() {
    var disabled = this.state.loading || !this.props.loggedIn
    var classes = cx({
      'loading': this.state.loading
    })

    return (
      <section id='main'>
        <div className={classes}>
          <div id='handsontable'></div>

          <footer id='footer'>
            <a href='http://wiredcraft.com' className='credit' target='_blank'>Built by Wiredcraft</a>
            <button className='button add' onClick={this.save} disabled={disabled}>Save your changes</button>
            <Message type={this.state.msg.type} message={this.state.msg.message} />
          </footer>

        </div>
      </section>
    );
  }
});

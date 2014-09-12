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

  mixins: [auth],

  getInitialState: function() {
    return {
      csv_data: [],
      editing: false,
      instance: {}
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
  componentDidMount: function() {

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
  componentDidUpdate: function(prevProps, prevState) {
    if(Object.keys(prevState.instance).length === 0) {
      var instance = $("#handsontable").handsontable('getInstance');
      this.setState({instance: instance})
    }
  },
  edit: function(e) {
    var self = this;
    this.setState({editing: true})

    // hello.login('github')
    // hello.on('auth.login', function(r) {
    //   console.log('auth.login', r);
    //   var github = new Github({
    //     token: r.authResponse.access_token,
    //     auth: 'oauth'
    //   });
    //   window.github = github
    //   self.setState({ github: github})
    // })
  },
  cancel: function(e) {
    console.log('on cancel')
    this.setState({editing: false})
  },
  save: function(e) {
    var self = this;
    console.log(helper.string(this.state.instance))
    this.setState({editing: false})

    // function getRepo(user) {
    //   var repo = self.state.github.getRepo(user.login, 'csviz')
    //   console.log('repo', repo)
    //   repo.getTree('master?recursive=true', function(err, tree) {
    //     console.log('tree', tree)

    //   });
    //   repo.write('master', 'helloworld.md', 'Hello world from csviz!', 'Update CSV file from CSViz.', function(err) {});

    // }

    // if (Object.keys(this.state.user).length > 0) {
    //   getRepo(this.state.user)
    // } else {
    //   this.state.github.getUser().show(null, function(err, data) {
    //     self.setState({user: data});
    //     getRepo(data)
    //   })
    // }


  },
  render: function() {
    var rows = this.state.csv_data.map(function (data, i) {
      return <tr key={i}><td>{data.Country}</td><td>{data.Indicator}</td></tr>;
    });
    // <div className={this.state.editing ? '' : 'hidden'}>
    //   <button onClick={this.cancel}>Cancel</button>
    //   <button onClick={this.save}>Save</button>
    // </div>
    // <div className={this.state.editing ? 'hidden' : ''}>
    //   <button onClick={this.edit}>Edit</button>
    // </div>
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

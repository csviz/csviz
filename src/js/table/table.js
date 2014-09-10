/** @jsx React.DOM */
'use strict';

var React = require('react');
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer

var csv = './sample.data.csv';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      csv_data: [],
      editing: false
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
  edit: function(e) {
    console.log('on edit')
    this.setState({editing: true})
  },
  cancel: function(e) {
    console.log('on cancel')
    this.setState({editing: false})
  },
  save: function(e) {
    console.log('on save')
    this.setState({editing: false})
  },
  render: function() {
    var rows = this.state.csv_data.map(function (data, i) {
      return <tr key={i}><td>{data.Country}</td><td>{data.Indicator}</td></tr>;
    });
    return (
      <div>
        <div className="pull-right">
          <div className={this.state.editing ? '' : 'hidden'}>
            <button onClick={this.cancel}>Cancel</button>
            <button onClick={this.save}>Save</button>
          </div>
          <div className={this.state.editing ? 'hidden' : ''}>
            <button onClick={this.edit}>Edit</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Country</th><th>Indicator</th></tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>

    );
  }
});

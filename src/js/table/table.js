/** @jsx React.DOM */
'use strict';

var React = require('react');
var bcsv = require('binary-csv')
var xhr = require('xhr')
var concat = require('concat-stream')
var Buffer = require('buffer').Buffer

var csv = 'sample.data.csv';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentWillMount: function() {
    var self = this;
    xhr({ responseType: 'arraybuffer', url: 'http://localhost/' + csv }, response)

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
    }
  },
  edit: function(e) {
    console.log('on edit')
  },
  cancel: function(e) {
    console.log('on cancel')
  },
  save: function(e) {
    console.log('on save')
  },
  render: function() {
    var rows = this.state.data.map(function (data, i) {
      return <tr key={i}><td>{data.Country}</td><td>{data.Indicator}</td></tr>;
    });
    return (
      <div>
        <div className="pull-right">
          <div>
            <button onClick={this.cancel}>Cancel</button>
            <button onClick={this.save}>Save</button>
          </div>
          <div>
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

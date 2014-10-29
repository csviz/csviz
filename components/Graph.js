/**
 * @jsx React.DOM
 */

var React = require('react')
var Gauge = require('./Graph/Gauge')
var LineChart = require('./Graph/LineChart')

var Graph = React.createClass({

  displayName: 'Graph',

  render: function() {
    return (
      <div classNama='graph-group'>
        <Gauge />
        <LineChart />
      </div>
    );
  }

});

module.exports = Graph;
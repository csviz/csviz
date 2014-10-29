/**
 * @jsx React.DOM
 */

var React = require('react')
var Chartist = require('chartist')

var Gauge = React.createClass({

  displayName: 'Gauge',

  componentDidMount: function() {
    new Chartist.Pie('.ct-chart.gauge-chart', {
      series: [20, 10, 30, 40]
    }, {
      donut: true,
      donutWidth: 60,
      startAngle: 270,
      total: 200,
      showLabel: false
    })
  },

  render: function() {
    return (
      <div className='gauge'>
        <div className='ct-chart gauge-chart'></div>
      </div>
    );
  }

});

module.exports = Gauge;
/**
 * @jsx React.DOM
 */

var React = require('react')
var Chartist = require('chartist')

var LineChart = React.createClass({

  displayName: 'LineChart',

  componentDidMount: function() {
    new Chartist.Line('.ct-chart.line-chart', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [
        [5, 9, 7, 8, 5, 3, 5, 4]
      ]
    }, {
      low: 0,
      showArea: true
    })
  },

  render: function() {
    return (
      <div className='line'>
        <div className='ct-chart line-chart'></div>
      </div>
    );
  }

});

module.exports = LineChart;
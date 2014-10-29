/**
 * @jsx React.DOM
 */

var React = require('react')
var Chartist = require('react-chartist')

var Graph = React.createClass({

  displayName: 'Graph',

  render: function() {

    var gaugeData = {
      series: [20, 10, 30, 40]
    }

    var gaugeOptions = {
      donut: true,
      donutWidth: 60,
      startAngle: 270,
      total: 200,
      showLabel: false
    }

    var lineChartData = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [
        [5, 9, 7, 8, 5, 3, 5, 4]
      ]
    }

    var lineChartOptions = {
      low: 0,
      showArea: true
    }

    return (
      <div classNama='graph-group'>
        Average
        <Chartist type={'Pie'} data={gaugeData} options={gaugeOptions}/>
        <Chartist type={'Line'} data={lineChartData} options={lineChartOptions}/>
      </div>
    );
  }

});

module.exports = Graph;
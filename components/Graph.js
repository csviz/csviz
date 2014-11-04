/**
 * @jsx React.DOM
 */

var React = require('react')
var Chartist = require('react-chartist')
// var GLOBALStore = require('../stores/GLOBALStore')

var Graph = React.createClass({

  displayName: 'Graph',

  render: function() {

    // var selected_indicator = GLOBALStore.getSelectedIndicator()
    // var globals = GLOBALStore.get()
    // if (globals && globals.data) {
    //   var indicators = globals.data.locations
    // }

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

    var barChartData = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    }

    var barChartOptions = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
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
      <div className='graph-group card'>
        <Chartist type={'Pie'} data={gaugeData} options={gaugeOptions} />
        <Chartist type={'Bar'} data={barChartData} options={barChartOptions} />
        <Chartist type={'Line'} data={lineChartData} options={lineChartOptions} />
      </div>
    );
  }

});

module.exports = Graph;
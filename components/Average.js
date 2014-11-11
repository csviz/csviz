'use strict'

var React = require('react')
var Chartist = require('react-chartist')
var GLOBALStore = require('../stores/GLOBALStore')
var _ = require('lodash')

var Average = React.createClass({

  displayName: 'Average',

  render() {
    var average

    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var globals = GLOBALStore.get()

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(globals)) {
      var values = _.map(globals.data.locations, selected_indicator)
      var barChartData = {
        labels: Object.keys(globals.data.locations),
        series: [ values ]
      }
      var barChartOptions = {
        high: globals.meta.indicators.poverty.max_value,
        low: globals.meta.indicators.poverty.min_value
      }
      average = _.reduce(values, function(sum, num) {
        return sum + num
      }) / values.length
    }

    return (
      <div className='card'>
        Average: {average}
        <Chartist type={'Bar'} data={barChartData} options={barChartOptions} />
      </div>
    )
  }

})

module.exports = Average
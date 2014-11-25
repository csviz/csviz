'use strict'

var React = require('react')
var Sparkline = require('react-sparkline')
var GLOBALStore = require('../stores/GLOBALStore')
var _ = require('lodash')
var numeral = require('numeral')

var Average = React.createClass({

  displayName: 'Average',

  render() {
    var average

    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var selected_year = GLOBALStore.getSelectedYear()
    var globals = GLOBALStore.get()
    var configs = this.props.configs

    var Chart = null
    var values = []
    var countryList = null
    var sl = null

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(globals)) {
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years) {
        values = _.map(_.map(globals.data.locations, selected_indicator), function(data) {
          return data['years'][selected_year]
        })

        countryList = Object.keys(globals.data.locations).map(function(countryName, key) {
          var formattedValue = numeral(globals.data.locations[countryName][selected_indicator].years[selected_year]).format('0,0')
          var countryData = _.map(globals.data.locations[countryName][selected_indicator].years, function(value) {
            return value
          })
          var countryChart = <Sparkline data={countryData} />

          return (
            <li key={key} className='countryItem'>
              <span className='label'>{globals.meta.locations[countryName].label}</span>
              <span className='chart'>{countryChart}</span>
              <span className='value'>{formattedValue}</span>
            </li>
          )
        })

        average = globals.meta.indicators[selected_indicator].avg.years[selected_year].toFixed(2)
        var dataSeries = _.map(globals.meta.indicators[selected_indicator].avg.years, function(value) {
          return (value.toFixed(2))/1000
        })

        Chart = <Sparkline data={dataSeries} />
      } else {
        values = _.map(globals.data.locations, selected_indicator)
        average = globals.meta.indicators[selected_indicator].avg.toFixed(2)
      }

    }

    return (
      <div className='card'>
        <div className='average-box'>
          <div className='average-box-header'>
            <span className='label'>Average</span>
            <div className='chart'>
              {Chart}
            </div>
            <span className='value'>{average}</span>
          </div>
          <div className='average-chart'>
            <ul className='country-list'>
              {countryList}
            </ul>
          </div>
        </div>
      </div>
    )
  }

})

module.exports = Average
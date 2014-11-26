'use strict'

var _ = require('lodash')
var React = require('react')
var Sparkline = require('react-sparkline')
var numeral = require('numeral')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var createStoreMixin = require('../mixins/createStoreMixin')

var Average = React.createClass({

  displayName: 'Average',

  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    return {
      selected_year: selected_year,
      selected_indicator: selected_indicator
    }
  },

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    Store.addYearChangeListener(this.handleStoreChange)

    this.setState(this.getStateFromStores())
  },

  handleStoreChange() {
    this.setState(this.getStateFromStores())
  },

  render() {
    var average, Chart, values, countryList
    var global = this.props.data.global
    var configs = this.props.data.configs
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(global)) {
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years.length) {
        values = _.map(_.map(global.data.locations, selected_indicator), function(data) {
          return data['years'][selected_year]
        })

        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var formattedValue = numeral(global.data.locations[countryName][selected_indicator].years[selected_year]).format('0,0')
          var countryData = _.map(global.data.locations[countryName][selected_indicator].years, function(value) {
            return value
          })
          var countryChart = <Sparkline data={countryData} />

          return (
            <li key={key} className='countryItem'>
              <span className='label'>{global.meta.locations[countryName].label}</span>
              <span className='chart'>{countryChart}</span>
              <span className='value'>{formattedValue}</span>
            </li>
          )
        })

        average = global.meta.indicators[selected_indicator].avg.years[selected_year].toFixed(2)
        var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, function(value) {
          return value.toFixed(2)
        })

        Chart = <Sparkline data={dataSeries} />
      } else {
        values = _.map(global.data.locations, selected_indicator)
        average = global.meta.indicators[selected_indicator].avg.toFixed(2)
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
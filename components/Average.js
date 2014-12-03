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
    var average, Chart, countryList
    var global = this.props.data.global
    var configs = this.props.data.configs
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(global)) {
      // indicator with years
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years.length) {
        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var formattedValue = numeral(global.data.locations[countryName][selected_indicator].years[selected_year]).format('0,0')
          var countryData = _.map(global.data.locations[countryName][selected_indicator].years, function(value) {
            return value
          })
          var countryChart = <Sparkline data={countryData} circleDiameter={0} />

          return (
            <li key={key} className='countryItem'>
              <span className='label'>{global.meta.locations[countryName].label}</span>
              <span className='chart'>{countryChart}</span>
              <span className='value'>{formattedValue}</span>
            </li>
          )
        })

        average = numeral(global.meta.indicators[selected_indicator].avg.years[selected_year]).format('0,0')
        var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, function(value) {
          return value.toFixed(2)
        })

        Chart = <Sparkline data={dataSeries} circleDiameter={0} />
      // indicator without years
      } else {
        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var countryValue = global.data.locations[countryName][selected_indicator]
          var formattedValue = countryValue ? (numeral(countryValue).format('0.000') + '%') : 'no data'
          return (
            <li key={key} className={ (countryValue ? '' : 'empty') + ' countryItem'}>
              <span className='label'>{global.meta.locations[countryName].label}</span>
              <span className='value'>{formattedValue}</span>
            </li>
          )
        })
        average = numeral(global.meta.indicators[selected_indicator].avg).format('0.000') + '%'
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
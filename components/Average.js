'use strict'

var _ = require('lodash')
var React = require('react')
var Sparkline = require('react-sparkline')
var mui = require('material-ui')
var Icon = mui.Icon
var numeral = require('numeral')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Average = React.createClass({

  displayName: 'Average',

  getInitialState() {
    return {
      isAverageOpen: false
    }
  },

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    Store.addYearChangeListener(this.handleStoreChange)
    Store.addCountryChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  onCountryClick(countryName) {
    MapActionCreators.changeSelectedCountry(countryName)
  },

  toggleAverage() {
    this.setState({isAverageOpen: !this.state.isAverageOpen})
  },

  render() {
    var average, Chart, countryList
    var global = this.props.data.global
    var configs = this.props.data.configs
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    var selected_country = Store.getSelectedCountry()

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(global)) {
      // indicator with years
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years.length) {
        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var hasData, formattedValue, countryData, countryChart

          if (global.data.locations[countryName][selected_indicator]) {
            formattedValue = numeral(global.data.locations[countryName][selected_indicator].years[selected_year]).format('0,0')
            countryData = _.map(global.data.locations[countryName][selected_indicator].years, function(value) {
              return value
            })
            countryChart = <Sparkline data={countryData} circleDiameter={0} />
            hasData = true
          } else {
            formattedValue = 'no data'
            hasData = false
          }

          return (
            <li key={key} className={ (hasData ? '' : 'empty') + (selected_country == countryName ? ' active' : '') + ' countryItem'} onClick={this.onCountryClick.bind(this, countryName)}>
              <span className='chart'>{countryChart}</span>
              <span className='value'>{formattedValue}</span>
              <div className='label'><span className='ellipsis'>{global.meta.locations[countryName].label}</span></div>

            </li>
          )
        }.bind(this))

        if (global.meta.indicators[selected_indicator].avg) {
          average = numeral(global.meta.indicators[selected_indicator].avg.years[selected_year]).format('0.000')
          var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, function(value) {
            return value.toFixed(2)
          })

          Chart = <Sparkline data={dataSeries} circleDiameter={0} />
        }

      // indicator without years
      } else {
        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var countryValue = global.data.locations[countryName][selected_indicator]
          var formattedValue = countryValue ? (numeral(countryValue).format('0.000') + '%') : 'no data'

          return (
            <li key={key} className={ (countryValue ? '' : 'empty') + (selected_country == countryName ? ' active' : '') + ' countryItem'} onClick={this.onCountryClick.bind(this, countryName)}>
              <span className='value'>{formattedValue}</span>
              <span className='label'>{global.meta.locations[countryName].label}</span>
            </li>
          )
        }.bind(this))
        average = numeral(global.meta.indicators[selected_indicator].avg).format('0.000') + '%'
      }

    }

    return (
      <div className='card'>
        <div className='average-box'>
          <div className='average-box-toggler'>
            <Icon icon={this.state.isAverageOpen ? 'hardware-keyboard-arrow-up' : 'hardware-keyboard-arrow-down'} onClick={this.toggleAverage}/>
          </div>

          <div className='average-box-header'>
            <div className='chart'>
              {Chart}
            </div>
            <span className='value'>{average}</span>
            <span className='label'>Average</span>
          </div>

          <div className='average-chart'>
            <ul className={ (this.state.isAverageOpen ? 'toggle-average-box-enter' : 'hide') + ' country-list' }>
              {countryList}
            </ul>
          </div>
        </div>
      </div>
    )
  }

})

module.exports = Average
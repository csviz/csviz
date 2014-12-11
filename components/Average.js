'use strict'

var _ = require('lodash')
var React = require('react')
var BarchartEnvelope = require('react-barchart-envelope')
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

            if (_.contains(countryData, null)) {
              countryChart = 'incomplete data'
            } else {
              countryChart = <BarchartEnvelope data={countryData}  width={80} height={20} />
            }

            hasData = true
          } else {
            formattedValue = 'No data'
            hasData = false
          }

          return (
            <li key={key} className={ (hasData ? '' : 'empty') + (selected_country == countryName ? ' active' : '') + ' countryItem'} onClick={this.onCountryClick.bind(this, countryName)}>
              <span className='label'>{global.meta.locations[countryName].label}</span>
              <span className='value'>{formattedValue}</span>
              <span className='chart'>{countryChart}</span>
            </li>
          )
        }.bind(this))

        if (global.meta.indicators[selected_indicator].avg) {
          average = numeral(global.meta.indicators[selected_indicator].avg.years[selected_year]).format('0.000')
          var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, function(value) {
            return value.toFixed(2)
          })

          Chart = <BarchartEnvelope data={dataSeries} width={80} height={20}/>
        }

      // indicator without years
      } else {
        countryList = Object.keys(global.data.locations).map(function(countryName, key) {
          var countryValue = global.data.locations[countryName][selected_indicator]
          var formattedValue = countryValue ? (numeral(countryValue).format('0.000') + '%') : 'No data'

          return (
            <li key={key} className={ (countryValue ? '' : 'empty') + (selected_country == countryName ? ' active' : '') + ' countryItem'} onClick={this.onCountryClick.bind(this, countryName)}>
              <span className='label'>{global.meta.locations[countryName].label}</span>
              <span className='value'>{formattedValue}</span>
            </li>
          )
        }.bind(this))
        average = numeral(global.meta.indicators[selected_indicator].avg).format('0.000') + '%'
      }

    }

    return (
      <section className='drilldown'>
        <header className='header'>
          <span className='label'>Average</span>
          <span className='value'>{average}</span>
          <span className='chart'>{Chart}</span>
        </header>
        <ul className='list'>
          {countryList}
        </ul>
      </section>
    )
  }

})

module.exports = Average
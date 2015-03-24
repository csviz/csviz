'use strict'

var _ = require('lodash')
var React = require('react')
var numeral = require('numeral')
var Router = require('react-router')
var objectAssign = require('react/lib/Object.assign')
var cx = React.addons.classSet
var AdditiveAnimation = require('additive-animation')
var mustache = require('mustache')

var safeTraverse = require('../utils/safeTraverse')
var BarchartEnvelope = require('./BarchartEnvelope')
var Scatterplot = require('./Scatterplot')
var MapUtils = require('../utils/MapUtils')
var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')
var Store = require('../stores/Store')

var Average = React.createClass({

  displayName: 'Average',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    Store.addYearChangeListener(this.handleStoreChange)
    Store.addCountryChangeListener(this.handleCountryChange)

    this.setState({})
  },

  componentWillUpdate(prevProps, prevState) {
    var averageContainer = this.getDOMNode()
    var selectedCountryElement = averageContainer.querySelector('ul .countryItem.active')

    if (!_.isUndefined(selectedCountryElement) && !_.isNull(selectedCountryElement)) {
      this.scrollToTop(selectedCountryElement.offsetTop)
    }
  },

  handleStoreChange() {
    this.setState({})
  },

  handleCountryChange() {
    this.handleStoreChange()
  },

  onCountryClick(countryName) {
    this.updateQuery({country: countryName})
    MapActionCreators.changeSelectedCountry(countryName)
  },

  onCircleClick(d, i) {
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = this.props.data.global.meta.indicators[selected_indicator].years[i]
    this.updateQuery({year: selected_year})
    MapActionCreators.changeSelectedYear(selected_year)
  },

  scrollToTop(offsetTop) {
    var sidebarPanel = document.querySelector('.sidebar-panel')
    var toState = offsetTop - 100
    // need to include the scatterplot height
    var fromState = sidebarPanel.scrollTop

    var animation = new AdditiveAnimation({
      enabledRAF: true,
      onRender: function(state) {
        sidebarPanel.scrollTop = state.scrollTop
      }
    })

    animation.animate({scrollTop: fromState}, {scrollTop: toState}, 1000, 'easeInOutQuart')
  },

  render() {
    var overall, Chart, countryList, countryChartBody
    var global = this.props.data.global
    var configs = this.props.data.configs
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    var selected_country = Store.getSelectedCountry()
    var onCircleClick = this.onCircleClick
    var hideAverage = false

    if (!_.isEmpty(selected_indicator) && !_.isEmpty(global)) {
      var indicators = global.data.locations
      var precision = parseInt(configs.indicators[selected_indicator].precision)
      var format = MapUtils.getFormatFromPrecision(precision)

      // indicator with years
      if (!_.isEmpty(configs) && configs.indicators[selected_indicator].years.length) {
        var selectedIndex = _.indexOf(global.meta.indicators[selected_indicator].years, selected_year)

        var displayTemplate = safeTraverse(configs, 'indicators', selected_indicator, 'display')
        hideAverage = safeTraverse(configs, 'indicators', selected_indicator, 'average')

        // filter country with gpe stuff
        countryList = Object.keys(indicators)
        .filter(function(countryName) {
          return countryName in indicators && (indicators[countryName] && indicators[countryName]['map_of_the_global_partnership_for_education'] != 1)
        })
        .map(function(countryName, key) {
          var hasData, formattedValue, countryData, countryChart

          if (indicators[countryName][selected_indicator]) {

            var dataObject = {}
            var values = MapUtils.matchContentFromTemplate(displayTemplate)
            values.forEach((indicatorName) => {
              indicatorName = indicatorName.trim()
              var indicatorId = MapUtils.getCountryNameId(indicatorName)
              var data = safeTraverse(indicators, countryName, indicatorId, 'years', selected_year)
              dataObject[indicatorName] = numeral(data).format(format)
            })

            if (displayTemplate) formattedValue = mustache.render(displayTemplate, dataObject)
            if (formattedValue === 0.00 || formattedValue === '0.00%') formattedValue = 'no data'

            // formattedValue = numeral(indicators[countryName][selected_indicator].years[selected_year]).format(format)
            countryData = _.map(indicators[countryName][selected_indicator].years, function(value) {
              return value || 0
            })

            countryChart = <BarchartEnvelope onCircleClick={onCircleClick} selectedIndex={selectedIndex} data={countryData} width={80} height={20} />
            countryChartBody = (
              <div className={(selected_country == countryName ? ' show' : '') + ' detail'}>
                <Scatterplot data={countryData} selectedIndex={selectedIndex} onCircleClick={onCircleClick} />
              </div>
            )

            hasData = true
          } else {
            formattedValue = 'No data'
            countryChartBody = null
            hasData = false
          }

          var classes = cx({
            'countryItem': true,
            'empty': !hasData,
            'active': selected_country == countryName
          })

          return (
            <li key={key} className={classes}>
              <header onClick={this.onCountryClick.bind(this, countryName)}>
                <span className='label'>{global.meta.locations[countryName].label}</span>
                <span className='value'>{formattedValue}</span>
                <span className='chart'>
                  {countryChart}
                </span>
              </header>
              {countryChartBody}
            </li>
          )
        }.bind(this))

        if (global.meta.indicators[selected_indicator].avg) {
          var hasInvalidValue = false

          if (selected_indicator != 'map_of_the_global_partnership_for_education') {
            overall = numeral(global.meta.indicators[selected_indicator].avg.years[selected_year]).format(format)
          }

          var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, function(value) {
            if (!value) {
              hasInvalidValue = true
              console.warn(selected_indicator + ' has invalid data')
            } else {
              return value.toFixed(2)
            }
          })

          if (!hasInvalidValue) Chart = <BarchartEnvelope onCircleClick={onCircleClick} selectedIndex={selectedIndex} data={dataSeries} width={80} height={20}/>
        }

      // gpe spefic stuff, donnor/donor...
      } else {
        countryList = Object.keys(indicators).map(function(countryName, key) {
          var countryValue = indicators[countryName][selected_indicator]
          var formattedValue = countryValue ? 'DONOR' : 'DONEE'

          var classes = cx({
            'countryItem': true,
            'empty': !countryValue,
            'active': selected_country == countryName
          })

          return (
            <li key={key} className={classes} onClick={this.onCountryClick.bind(this, countryName)}>
              <header onClick={this.onCountryClick.bind(this, countryName)}>
                <span className='label'>{global.meta.locations[countryName].label}</span>
                <span className='value'>{formattedValue}</span>
              </header>
            </li>
          )
        }.bind(this))
        if (selected_indicator != 'map_of_the_global_partnership_for_education') {
          overall = numeral(global.meta.indicators[selected_indicator].avg).format(format)
        }
      }

    }

    return (
      <section className='drilldown'>
        { !hideAverage &&
          <header className='header'>
            <span className='label'>Average in GPE countries</span>
            <span className='value'>{overall}</span>
            <span className='chart'>{Chart}</span>
          </header>
        }
        <ul className='list'>
          {countryList}
        </ul>
      </section>
    )
  }

})

module.exports = Average

'use strict'

var _ = require('lodash')
var React = require('react')
var mustache = require('mustache')
var numeral = require('numeral')
var cx = React.addons.classSet
var Router = require('react-router')

var MapUtils = require('../utils/MapUtils')
var Scatterplot = require('./Scatterplot')
var safeTraverse = require('../utils/safeTraverse')
var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')
var BarchartEnvelope = require('./BarchartEnvelope')

var CountryList = React.createClass({

  displayName: 'CountryList',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  onCountryClick(countryName) {
    this.updateQuery({country: countryName})
    MapActionCreators.changeSelectedCountry(countryName)
  },

  onCircleClick(d, i) {
    var selected_indicator = this.props.selectedIndicator;
    var selected_year = this.props.data.global.meta.indicators[selected_indicator].years[i]
    this.updateQuery({year: selected_year})
    MapActionCreators.changeSelectedYear(selected_year)
  },

  render() {
    var countryChartBody;
    var indicators = this.props.data.global.data.locations;
    var selected_country = this.props.selectedCountry;
    var selected_indicator = this.props.selectedIndicator;
    var selected_year = this.props.selectedYear;

    var selectedIndex = _.indexOf(this.props.data.global.meta.indicators[selected_indicator].years, selected_year);
    var displayTemplate = safeTraverse(this.props.data.configs, 'indicators', selected_indicator, 'display');
    var precision = parseInt(this.props.data.configs.indicators[selected_indicator].precision);
    var format = MapUtils.getFormatFromPrecision(precision);
    var onCircleClick = this.onCircleClick;

    // filter country with gpe stuff
    var countryList = Object.keys(indicators)
      .filter(function(countryName) {
        return countryName in indicators && (indicators[countryName] && indicators[countryName]['map_of_the_global_partnership_for_education'] != 1)
      })
      .map((countryName, key) => {
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
              <span className='label'>{this.props.data.global.meta.locations[countryName].label}</span>
              <span className='value'>{formattedValue}</span>
              <span className='chart'>
                {countryChart}
              </span>
            </header>
            {countryChartBody}
          </li>
        )
      });

    return (
      <ul className='list'>
        { countryList }
      </ul>
    );
  }

})

module.exports = CountryList;

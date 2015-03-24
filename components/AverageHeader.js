'use strict'

var _ = require('lodash')
var React = require('react')
var numeral = require('numeral')
var Router = require('react-router')

var BarchartEnvelope = require('./BarchartEnvelope')
var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')
var Store = require('../stores/Store')
var MapUtils = require('../utils/MapUtils')

var AverageHeader = React.createClass({

  displayName: 'AverageHeader',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  onCircleClick(d, i) {
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = this.props.data.global.meta.indicators[selected_indicator].years[i]
    this.updateQuery({year: selected_year})
    MapActionCreators.changeSelectedYear(selected_year)
  },

  render() {
    var overall;
    var configs = this.props.data.configs;
    var global = this.props.data.global;
    var selected_indicator = this.props.selectedIndicator;
    var selected_year = this.props.selectedYear;

    // Chart
    var selectedIndex = _.indexOf(global.meta.indicators[selected_indicator].years, selected_year);
    var dataSeries = _.map(global.meta.indicators[selected_indicator].avg.years, (value) => value.toFixed(2))
    var Chart = <BarchartEnvelope onCircleClick={this.onCircleClick} selectedIndex={selectedIndex} data={dataSeries} width={80} height={20}/>

    // Overall
    if (selected_indicator != 'map_of_the_global_partnership_for_education') {
      var precision = parseInt(configs.indicators[selected_indicator].precision)
      var format = MapUtils.getFormatFromPrecision(precision)
      overall = numeral(global.meta.indicators[selected_indicator].avg.years[selected_year]).format(format)
    }

    return (
      <header className='header'>
        <span className='label'>Average in GPE countries</span>
        <span className='value'>{overall}</span>
        <span className='chart'>{Chart}</span>
      </header>
    )
  }

})

module.exports = AverageHeader

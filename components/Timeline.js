'use strict'

var React = require('react')
var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var createStoreMixin = require('../mixins/createStoreMixin')

var Timeline = React.createClass({

  displayName: 'Timeline',

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

  handleYearClick(e) {
    var selected_year = e.target.innerHTML
    MapActionCreators.changeSelectedYear(selected_year)
  },

  render() {
    var timeline = null
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()

    if (this.props.data.global && selected_indicator && selected_year && this.props.data.configs.indicators[selected_indicator].years.length) {
      timeline = this.props.data.global.meta.indicators[selected_indicator].years.map(function(year) {
        return <li key={year} value={year} className={ (year == selected_year) ? 'active' : null } onClick={this.handleYearClick}>{year}</li>
      }, this)
    }

    return (
      <div className='timeline-box'>
        <ul className='timeline'>
          { timeline }
        </ul>
      </div>
    )
  }

})

module.exports = Timeline
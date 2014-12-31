'use strict'

var _ = require('lodash')
var React = require('react')
var Router = require('react-router')
var objectAssign = require('object-assign')
var MapUtils = require('../utils/MapUtils')
var Dropdown = require('./Dropdown')

var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')
var Store = require('../stores/Store')

var IndicatorSelector = React.createClass({

  displayName: 'IndicatorSelector',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  hanldeSelectChange(options) {
    this.updateQuery({indicator: options.value})
    MapActionCreators.changeIndicator(options.value)
  },

  render() {
    var MenuItems, indicatorDescription, defaultIndicator
    var data = this.props.data
    var selected_indicator = Store.getSelectedIndicator()


    // after get the configs
    if (data.configs && data.configs.indicators && selected_indicator) {

      var menuData = data.configs.ui.menu
      var menu = menuData.map(function(menuItem, menuIndex) {
        if (_.isString(menuItem)) {
          var value = MapUtils.getCountryNameId(menuItem)
          var _options = { value: value, label: menuItem }
          // set default one
          if (value === selected_indicator) defaultIndicator = _options
          return _options
        } else if (_.isObject(menuItem)) {
          var groupName = Object.keys(menuItem)[0]
          var options = menuItem[groupName].map(function(optionsItem, index) {
            var value = MapUtils.getCountryNameId(optionsItem)
            var _options = { value: value, label: optionsItem }
            if (value === selected_indicator) defaultIndicator = _options
            return _options
          })
          return {
            type: 'group',
            name: groupName,
            items: options
          }
        }
      })

      indicatorDescription = data.configs.indicators[selected_indicator].description

    } else {
      MenuItems = null
    }

    return (
      <section className='indicator'>
        <header className='select'>
          <Dropdown options={menu} onChange={this.hanldeSelectChange} value={defaultIndicator} />
        </header>
        <p className='description'>{indicatorDescription}</p>

      </section>
    )
  }

})

module.exports = IndicatorSelector
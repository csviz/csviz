'use strict'

var _ = require('lodash')
var React = require('react')
var mui = require('material-ui')
var DropDownMenu = mui.DropDownMenu

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var createStoreMixin = require('../mixins/createStoreMixin')

var IndicatorSelector = React.createClass({

  displayName: 'IndicatorSelector',

  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    var selected_indicator = Store.getSelectedIndicator()

    return {
      selected_indicator: selected_indicator
    }
  },

  hanldeSelectChange(e, key, menuItem) {
    MapActionCreators.changeIndicator(menuItem.payload)
  },

  render() {
    var MenuItems = 'loading...'
    var indicatorDescription = 'loading...'

    var data = this.props.data

    // after get the configs
    if (data.configs && data.configs.indicators) {
      var indicators = data.configs.indicators
      var menuItems = Object.keys(indicators)
        .filter(key => indicators[key].name)
        .map(key => ({ payload: key, text: indicators[key].name }))

      if (this.state.selected_indicator) {
        indicatorDescription = data.configs.indicators[this.state.selected_indicator].description
      } else {
        indicatorDescription = 'There\'s no description for this indicator.'
      }

      // get default selected index
      var selectedIndex = _.indexOf(Object.keys(indicators).filter(function(key) {
        return indicators[key].name
      }), this.state.selected_indicator)
      MenuItems = <DropDownMenu onChange={this.hanldeSelectChange} selectedIndex={selectedIndex} menuItems={menuItems} />

    } else {
      MenuItems = null
    }

    return (
      <div className='card'>

        <div className='selector-box'>

          <div className='selector'>

            {MenuItems}

          </div>

          <div className='selector-description'>
            <h5>Description</h5>
            <p>{indicatorDescription}</p>
          </div>

        </div>

      </div>
    )
  }

})

module.exports = IndicatorSelector
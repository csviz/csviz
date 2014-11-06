'use strict'

var React = require('react')
var mui = require('material-ui')
var DropDownMenu = mui.DropDownMenu

var SelectBox = require('react-select-box')
var MapActionCreators = require('../actions/MapActionCreators')
var GLOBALStore = require('../stores/GLOBALStore')
var createStoreMixin = require('../mixins/createStoreMixin')

var IndicatorSelector = React.createClass({

  displayName: 'IndicatorSelector',

  mixins: [createStoreMixin(GLOBALStore)],

  getStateFromStores() {
    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var global_data = GLOBALStore.get()

    return {
      selected_indicator: selected_indicator,
      globals: global_data
    }
  },

  hanldeSelectChange(e, key, menuItem) {
    MapActionCreators.changeIndicator(menuItem.payload)
  },

  render() {
    var menuItems, indicatorDescription
    if (this.props.configs && this.props.configs.indicators) {
      var indicators = this.props.configs.indicators
      menuItems = Object.keys(indicators)
        .filter(function(key) {
          return indicators[key].name
        })
        .map(function(key, index) {
            return { payload: key, text: indicators[key].name }
        }.bind(this))

        if (this.props.configs && this.props.configs.indicators && this.state.selected_indicator) {
          indicatorDescription = this.props.configs.indicators[this.state.selected_indicator].description
        } else {
          indicatorDescription = null
        }

        menuItems = <DropDownMenu onChange={this.hanldeSelectChange} menuItems={menuItems} />
    } else {
      menuItems = null
    }

    return (
      <div className='card'>

        <div className='selector-box'>

          <div className='selector'>

            {menuItems}

          </div>

          <div className='selector-description'>
            {indicatorDescription}
          </div>

        </div>

      </div>
    )
  }

})

module.exports = IndicatorSelector
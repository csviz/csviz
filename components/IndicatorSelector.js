'use strict'

var React = require('react')
var SelectBox = require('react-select-box')
var MapActionCreators = require('../actions/MapActionCreators')
var GLOBALStore = require('../stores/GLOBALStore')
var createStoreMixin = require('../mixins/createStoreMixin')

var IndicatorSelector = React.createClass({

  displayName: 'IndicatorSelector',

  mixins: [createStoreMixin(GLOBALStore)],

  getStateFromStores: function() {
    var selected_indicator = GLOBALStore.getSelectedIndicator()
    var global_data = GLOBALStore.get()

    return {
      selected_indicator: selected_indicator,
      globals: global_data
    }
  },

  hanldeSelectChange(indicator) {
    MapActionCreators.changeIndicator(indicator)
  },

  render() {
    var options, indicatorDescription
    if (this.props.configs && this.props.configs.indicators) {
      var indicators = this.props.configs.indicators
      options = Object.keys(indicators)
        .filter(function(key) {
          return indicators[key].name
        })
        .map(function(key, index) {
            return <option value={key}>{indicators[key].name}</option>
        }.bind(this))

        if (this.props.configs && this.props.configs.indicators && this.state.selected_indicator) {
          indicatorDescription = this.props.configs.indicators[this.state.selected_indicator].description
        } else {
          indicatorDescription = null
        }
    } else {
      options = null
    }

    return (
      <div className='card'>
        <SelectBox
          label={'Select an indicator'}
          onChange={this.hanldeSelectChange}
          value={this.state.selected_indicator}
        >
          {options}
        </SelectBox>

        <div className='description'>
          {indicatorDescription}
        </div>
      </div>
    )
  }

})

module.exports = IndicatorSelector
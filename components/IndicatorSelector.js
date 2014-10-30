/**
 * @jsx React.DOM
 */

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
    var meta = this.state.globals.meta || {}
    var indicators = meta.indicators || {}

    return (
      <div className='card'>
        <SelectBox
          label={'Select an indicator'}
          onChange={this.hanldeSelectChange}
          value={this.state.selected_indicator}
        >
          {
            Object.keys(indicators).map(function(key, index) {
              return <option value={key}>{key}</option>
            })
          }
        </SelectBox>
      </div>
    )
  }

})

module.exports = IndicatorSelector
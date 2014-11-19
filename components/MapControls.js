'use strict'

var React = require('react')
var _ = require('lodash')

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Timeline = require('./Timeline')
var Average = require('./Average')
var SearchBar = require('./SearchBar')
var GLOBALStore = require('../stores/GLOBALStore')

var MapControls = React.createClass({

  displayName: 'MapControls',

  render() {
    var selected_indicator = GLOBALStore.getSelectedIndicator()

    return (
      <div className='sidebar'>

        <ControlHeader configs={this.props.configs} />

        {  this.props.configs.indicators && !_.isEmpty(selected_indicator) && this.props.configs.indicators[selected_indicator].years ?
          <Timeline /> : null
        }

        <SearchBar />

        <IndicatorSelector configs={this.props.configs} />

        <SocialPanel configs={this.props.configs} />

        <Average configs={this.props.configs} />

      </div>
    )
  }

})

module.exports = MapControls
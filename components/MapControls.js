'use strict'

var React = require('react')

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Graph = require('./Graph')
var Timeline = require('./Timeline')
var Average = require('./Average')
var GLOBALStore = require('../stores/GLOBALStore')

var MapControls = React.createClass({

  displayName: 'MapControls',

  render() {
    var selected_indicator = GLOBALStore.getSelectedIndicator()

    return (
      <div className='sidebar'>
        <ControlHeader configs={this.props.configs} />

        <IndicatorSelector configs={this.props.configs} />

        {  this.props.configs.indicators && this.props.configs.indicators[selected_indicator].years ?
          <Timeline /> : null
        }

        <SocialPanel configs={this.props.configs} />

        { selected_indicator === 'poverty' ?
          <Average /> : null
        }

        { /* <Graph configs={this.props.configs} /> */ }
      </div>
    )
  }

})

module.exports = MapControls
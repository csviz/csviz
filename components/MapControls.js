'use strict'

var React = require('react')

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Graph = require('./Graph')
var Timeline = require('./Timeline')

var MapControls = React.createClass({

  displayName: 'MapControls',

  render() {
    return (
      <div className='sidebar'>
        <ControlHeader configs={this.props.configs} />
        <IndicatorSelector configs={this.props.configs} />
        <Timeline />
        <SocialPanel />
        <Graph configs={this.props.configs} />
      </div>
    )
  }

})

module.exports = MapControls
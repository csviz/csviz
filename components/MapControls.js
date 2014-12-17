'use strict'

var React = require('react')

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Average = require('./Average')

var MapControls = React.createClass({

  displayName: 'MapControls',

  render() {
    return (
      <aside id='sidebar'>
      <div className='sidebarPanel'>
        <ControlHeader data={this.props.data} />
        <IndicatorSelector data={this.props.data} />
        <SocialPanel data={this.props.data} />
        <Average data={this.props.data} />
        </div>
      </aside>
    )
  }

})

module.exports = MapControls
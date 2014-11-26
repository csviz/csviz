'use strict'

var React = require('react')

var ControlHeader = require('./ControlHeader')
var Timeline = require('./Timeline')
var SearchBar = require('./SearchBar')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Average = require('./Average')

var MapControls = React.createClass({

  displayName: 'MapControls',

  render() {

    return (
      <div className='sidebar'>

        <ControlHeader data={this.props.data} />

        <Timeline data={this.props.data} />

        <SearchBar data={this.props.data} />

        <IndicatorSelector data={this.props.data} />

        <SocialPanel data={this.props.data} />

        <Average data={this.props.data} />

      </div>
    )
  }

})

module.exports = MapControls
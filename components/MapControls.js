'use strict'

var React = require('react')

var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Average = require('./Average')

var MapControls = React.createClass({

  displayName: 'MapControls',
  render() {
    return (
      <aside id='sidebar'>
        <div className='sidebar-panel'>
          <IndicatorSelector {...this.props} />
          <SocialPanel {...this.props} />
          <Average {...this.props} />
        </div>
      </aside>
    )
  }

})

module.exports = MapControls

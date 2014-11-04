'use strict'

var React = require('react')

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  render: function() {
    var site = this.props.configs.site || {}
    return (
      <div className='control-header card'>
        <img src={site.logo} />
        <span>{site.name}</span>
        <div>
          <small>{site.description}</small>
        </div>
      </div>
    )
  }

})

module.exports = ControlHeader
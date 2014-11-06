'use strict'

var React = require('react')

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  render() {
    var site = this.props.configs.site || {}
    return (
      <div className='card'>
        <div className='header'>
          <img src={site.logo} />
          <h1>{site.name}</h1>
        </div>
      </div>
    )
  }

})

module.exports = ControlHeader
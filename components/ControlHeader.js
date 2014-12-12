'use strict'

var React = require('react')

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  render() {
    var site = {}

    if (this.props.data.configs) {
      site = this.props.data.configs.site || {}
    }

    return (
      <header className='header'>
        <h1>{site.name}</h1>
        <span>{site.description}</span>
      </header>
    )
  }

})

module.exports = ControlHeader
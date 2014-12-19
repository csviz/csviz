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
      <header className='header tablet-nav'>
        <h1>{site.name}</h1>
        <span>{site.description}</span>
        <h2>DataHub</h2>
        <ul>
        <li><a><img src="assets/images/icon-texture.png" width="18"/></a></li>
        <li><a><img src="assets/images/icon-search.png" width="18"/></a></li>
        </ul>
      </header>
    )
  }

})

module.exports = ControlHeader
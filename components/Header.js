/**
 * @jsx React.DOM
 */

var React = require('react')

var Header = React.createClass({

  displayName: 'Header',

  render: function() {
    var site = this.props.configs.site || {}
    return (
      <div className='header'>
        <img src={site.logo} />
        <span>{site.name}</span>
        <small>{site.description}</small>
      </div>
    )
  }

})

module.exports = Header
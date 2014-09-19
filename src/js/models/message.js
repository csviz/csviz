/**
 * @jsx React.DOM
 */

var React = require('react')

var message = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['error', 'success']),
    message: React.PropTypes.string
  },
  render: function() {
    var className = 'msg ' + (this.props.type || '')

    if(this.props.message.length > 0) {
      return (
        <div className={className}>
          <p>{this.props.message}</p>
        </div>
      )
    } else{
      return <noscript />
    }
  }
})

module.exports = message

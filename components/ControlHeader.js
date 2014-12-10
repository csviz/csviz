'use strict'

var React = require('react')
var mui = require('material-ui')
var Icon = mui.Icon
var Dialog = mui.Dialog

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  _showDialog() {
    this.refs.aboutDialog.show()
  },

  render() {
    var site = {}
    var dialogActions = [{ text: 'CLOSE' }]

    if (this.props.data.configs) {
      site = this.props.data.configs.site || {}
    }

    return (
      <header className='header'>
        <h1>{site.name}</h1>
      </header>
    )
  }

})

module.exports = ControlHeader
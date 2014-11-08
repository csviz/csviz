'use strict'

var React = require('react')
var mui = require('material-ui')
var Icon = mui.Icon
var Dialog = mui.Dialog

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  _showDialog: function() {
    this.refs.aboutDialog.show()
  },

  render() {
    var site = this.props.configs.site || {}

    return (
      <div className='card'>
        <div className='header'>
          <img src={site.logo} />
          <h1>{site.name}</h1>
          <div className='about'>
            <Icon icon='action-info' onClick={this._showDialog} />
          </div>
        </div>

        <Dialog ref='aboutDialog' title='About'>

          Country borders or names do not necessarily reflect the Global Partnership for Education's official position. This map is for illustrative purposes and does not imply the expression of any opinion on the part of the Global Partnership for Education, concerning the legal status of any country or territory or concerning the delimitation of frontiers or boundaries.

        </Dialog>
      </div>
    )
  }

})

module.exports = ControlHeader
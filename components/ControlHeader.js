'use strict'

var React = require('react')
var mui = require('material-ui')
var Dialog = mui.Dialog

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  componentDidMount() {
    Store.addSearchChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  _showDialog() {
    this.refs.legendDialog.show();
  },

  _toggleSearch() {
    var currentSearchStatus = Store.getSearchStatus()
    var status = !currentSearchStatus
    MapActionCreators.changeSearchStatus(status)
  },

  render() {
    var site = {}
    var dialogActions = [
      { text: 'CLOSE' }
    ]

    if (this.props.data.configs) {
      site = this.props.data.configs.site || {}
    }

    return (
      <div className="header-container">
      <header className='header tablet-nav'>
        <h1>{site.name}</h1>
        <span>{site.description}</span>
        <h2>{site.name}</h2>
        <ul>
           <li><a onClick={this._showDialog}><img src="assets/images/icon-texture.png" width="18"/></a></li>
          <li><a onClick={this._toggleSearch}><img src="assets/images/icon-search.png" width="18"/></a></li>
        </ul>
      </header>
      </div>
    )
  }

})

module.exports = ControlHeader
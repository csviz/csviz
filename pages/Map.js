'use strict'

var _ = require('lodash')
var React = require('react')
var DocumentTitle = require('react-document-title')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  getInitialState() {
    return {
      data: Store.getAll()
    }
  },

  componentDidMount() {
    Store.addChangeListener(this.handleStoresChanged)

    MapActionCreators.requestAll()
  },

  componentWillUnmount() {
    Store.removeChangeListener(this.handleStoresChanged)
  },

  handleStoresChanged() {
    if (this.isMounted()) {
      this.setState({data: Store.getAll()})
    }
  },

  render() {
    return (
      <DocumentTitle title='Map'>
        <section className={_.isEmpty(this.state.data) ? 'loading' : ''} id='app'>
          <Map data={this.state.data} />
          <MapControls data={this.state.data} />
        </section>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
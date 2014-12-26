'use strict'

var _ = require('lodash')
var Router = require('react-router')
var React = require('react')
var DocumentTitle = require('react-document-title')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [ Router.State ],

  getInitialState() {
    return {
      data: Store.getAll()
    }
  },

  componentDidMount() {
    Store.addChangeListener(this.handleStoresChanged)

    MapActionCreators.requestAll(this.getQuery())
  },

  componentWillUnmount() {
    Store.removeChangeListener(this.handleStoresChanged)
  },

  handleStoresChanged() {
    if (this.isMounted()) this.setState({data: Store.getAll()})
  },

  render() {
    var cx = React.addons.classSet
    var classes = cx({
      'loading': _.isEmpty(this.state.data)
    })

    return (
      <DocumentTitle title='Map'>
        <section className={classes} id='app'>
          <Map data={this.state.data} />
          <MapControls data={this.state.data} />
        </section>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
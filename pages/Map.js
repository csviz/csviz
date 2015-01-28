'use strict'

var _ = require('lodash')
var Router = require('react-router')
var React = require('react')
var DocumentTitle = require('react-document-title')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')
var Pattern = require('../components/Pattern')

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
    Store.addIndicatorChangeListener(this.addIndicatorChangeListener)

    MapActionCreators.requestAll(this.getQuery())
  },

  componentWillUnmount() {
    Store.removeChangeListener(this.handleStoresChanged)
  },

  addIndicatorChangeListener() {
    this.setState({})
  },

  handleStoresChanged() {
    if (this.isMounted()) this.setState({data: Store.getAll()})
  },

  render() {
    var cx = React.addons.classSet
    var classes = cx({
      'loading': _.isEmpty(this.state.data)
    })
    var siteName = '', indicatorName = ''

    if (this.state.data && this.state.data.configs) {
      siteName = this.state.data.configs.site.name
      var selected_indicator = Store.getSelectedIndicator()
      if (!_.isUndefined(selected_indicator)) indicatorName = this.state.data.global.meta.indicators[selected_indicator].source_file.replace('.csv', '') + ' |'
    }

    return (
      <DocumentTitle title={indicatorName + ' ' + siteName} >
        <section className={classes} id='app'>
          <Map data={this.state.data} />
          <Pattern />
          <MapControls data={this.state.data} />
        </section>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage

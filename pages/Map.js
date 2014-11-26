'use strict'

var React = require('react')
var DocumentTitle = require('react-document-title')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')
var createStoreMixin = require('../mixins/createStoreMixin')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    return {
      data: Store.getAll()
    }
  },

  componentDidMount() {
    MapActionCreators.requestAll()
  },

  render() {
    return (
      <DocumentTitle title='Map'>
        <div className='container'>
          <Map data={this.state.data} />
          <MapControls data={this.state.data} />
        </div>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
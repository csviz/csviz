/**
 * @jsx React.DOM
 */

var React = require('react')
var DocumentTitle = require('react-document-title')
var createStoreMixin = require('../mixins/createStoreMixin')

var GEOStore = require('../stores/GEOStore')
var GLOBALStore = require('../stores/GLOBALStore')
var CONFIGStore = require('../stores/CONFIGStore')
var MapActionCreators = require('../actions/MapActionCreators')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(GEOStore, GLOBALStore, CONFIGStore)],

  getStateFromStores: function() {
    var geo_data = GEOStore.get()
    var global_data = GLOBALStore.get()
    var config_data = CONFIGStore.get()

    return {
      geo: geo_data,
      configs: config_data,
      globals: global_data
    }
  },

  componentDidMount: function() {
    MapActionCreators.requestGEO()
    MapActionCreators.requestGlobal()
    MapActionCreators.requestConfig()
  },

  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div className='container'>
          <Map configs={this.state.configs} geo={this.state.geo} globals={this.state.globals} />
          <MapControls configs={this.state.configs} />
        </div>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
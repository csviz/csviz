/**
 * @jsx React.DOM
 */

var React = require('react')
var DocumentTitle = require('react-document-title')
var createStoreMixin = require('../mixins/createStoreMixin')

var GEOStore = require('../stores/GEOStore')
var INDICATORStore = require('../stores/INDICATORStore')
var CONFIGStore = require('../stores/CONFIGStore')
var MapActionCreators = require('../actions/MapActionCreators')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(GEOStore, INDICATORStore, CONFIGStore)],

  getStateFromStores: function() {
    var geo_data = GEOStore.get()
    var indicator_data = INDICATORStore.get()
    var config_data = CONFIGStore.get()

    return {
      geo: geo_data,
      configs: config_data,
      indicators: indicator_data
    }
  },

  componentDidMount: function() {
    MapActionCreators.requestGEO()
    MapActionCreators.requestIndicator()
  },


  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div className='container'>
          <Map geo={this.state.geo_data} />
          <MapControls configs={this.state.configs} />
        </div>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
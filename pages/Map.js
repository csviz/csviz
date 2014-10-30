/**
 * @jsx React.DOM
 */

var React = require('react')
var DocumentTitle = require('react-document-title')
var createStoreMixin = require('../mixins/createStoreMixin')

var GEOStore = require('../stores/GEOStore')
var INDICATORStore = require('../stores/INDICATORStore')
var MapActionCreators = require('../actions/MapActionCreators')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(GEOStore, INDICATORStore)],

  getStateFromStores: function() {
    var geo_data = GEOStore.get()
    var indicator_data = INDICATORStore.get()

    return {
      geo_data: geo_data,
      indicator_data: indicator_data
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
          <MapControls />
        </div>
      </DocumentTitle>
    )
  }

})

module.exports = MapPage
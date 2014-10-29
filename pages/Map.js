/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');
var createStoreMixin = require('../mixins/createStoreMixin');

var GEOStore = require('../stores/GEOStore')
var CONFIGStore = require('../stores/CONFIGStore')
var MapActionCreators = require('../actions/MapActionCreators')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(GEOStore, CONFIGStore)],

  getStateFromStores: function() {
    var geo_data = GEOStore.get()
    var config_data = CONFIGStore.get()

    return {
      geo_data: geo_data,
      config_data: config_data
    }
  },

  componentDidMount: function() {
    MapActionCreators.requestGEO()
    MapActionCreators.requestConfig()
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps !== this.props) {
      MapActionCreators.requestGEO()
      MapActionCreators.requestConfig()
    }
  },

  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div className='container'>
          <Map geo={this.state.geo_data} />
          <MapControls />
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = MapPage;
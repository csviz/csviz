/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');
var createStoreMixin = require('../mixins/createStoreMixin');

var GEOStore = require('../stores/GEOStore')
var MapActionCreators = require('../actions/MapActionCreators')

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  displayName: 'MapPage',

  mixins: [createStoreMixin(GEOStore)],

  getStateFromStores: function() {
    var geo_data = GEOStore.get()

    return {
      geo_data: geo_data
    }
  },

  componentWillMount: function() {
    MapActionCreators.requestGEO()
  },

  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div className='container'>
          <Map />
          <MapControls />
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = MapPage;
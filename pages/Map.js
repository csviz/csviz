/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');

var Map = require('../components/Map')
var MapControls = require('../components/MapControls')

var MapPage = React.createClass({

  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div>
          <Map />
          <MapControls />
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = MapPage;
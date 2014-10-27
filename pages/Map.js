/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');

var MapPage = React.createClass({

  render: function() {
    return (
      <DocumentTitle title='Map'>
        <div>
          Map
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = MapPage;
/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');

var NotFound = React.createClass({

  render: function() {
    return (
      <DocumentTitle title='Page Not Found'>
        <div>
          Page Not Found!
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = NotFound;
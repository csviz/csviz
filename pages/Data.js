/**
 * @jsx React.DOM
 */

var React = require('react');
var DocumentTitle = require('react-document-title');

var DataPage = React.createClass({

  render: function() {
    return (
      <DocumentTitle title='Data'>
        <div>
          DataPage
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = DataPage;
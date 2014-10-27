/**
 * @jsx React.DOM
 */

var React = require('react');

var Header = React.createClass({

  displayName: 'Header',

  render: function() {
    return (
      <div className='header'>
        CSViz
      </div>
    );
  }

});

module.exports = Header;
/**
 * @jsx React.DOM
 */

var React = require('react');

var ControlHeader = React.createClass({

  displayName: 'ControlHeader',

  render: function() {
    return (
      <div className='control-header'>
        <img src='../assets/images/logo.png' />
        <a href='http://csviz.org'>CSViz</a>
      </div>
    );
  }

});

module.exports = ControlHeader;
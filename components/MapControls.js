/**
 * @jsx React.DOM
 */

var React = require('react');

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var IndicatorDescription = require('./IndicatorDescription')
var SocialPanel = require('./SocialPanel')
var Graph = require('./Graph')

var MapControls = React.createClass({

  render: function() {
    return (
      <div>
        <ControlHeader />
        <IndicatorSelector />
        <IndicatorDescription />
        <SocialPanel />
        <Graph />
      </div>
    );
  }

});

module.exports = MapControls;
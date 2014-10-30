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

  displayName: 'MapControls',

  render() {
    return (
      <div className='sidebar'>
        <ControlHeader configs={this.props.configs} />
        <IndicatorSelector />
        <IndicatorDescription />
        <SocialPanel />
        <Graph />
      </div>
    );
  }

});

module.exports = MapControls;
/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');

// Pages
var Map = require('./map/map.js');
var Table = require('./table/table.js');

// Router
var Routes = require('react-router/Routes');
var Route = require('react-router/Route');
var Link = require('react-router/Link');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <div className='header'>
            <img className='logo' src='./dist/assets/images/logo.png' />
            <h1>Hello, CSViz.</h1>
          </div>

          <nav>
            <ul>
              <li><Link to="table">Table</Link></li>
              <li><Link to="map">Map</Link></li>
            </ul>
          </nav>
        </header>

        <this.props.activeRouteHandler />
      </div>
    );
  }
});

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <Route name='table' path='/table' handler={Table} />
      <Route name='map' path='/map' handler={Map} />
    </Route>
  </Routes>
);

React.renderComponent(routes, document.body);

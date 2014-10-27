/** @jsx React.DOM */

'use strict';

var React = require('react')
var Router = require('react-router')
var DocumentTitle = require('react-document-title')

// Router
var DefaultRoute = Router.DefaultRoute
var Link = Router.Link
var NotFoundRoute = Router.NotFoundRoute
var Route = Router.Route
var Routes = Router.Routes

// Pages
var DataPage = require('./pages/Data')
var MapPage = require('./pages/Map')
var NotFound = require('./pages/NotFound')

// Components
var Header = require('./components/Header')

var App = React.createClass({

  displayName: 'App',

  propTypes: {
    ac: React.PropTypes.func
  },

  render: function() {
    return (
      <DocumentTitle title='CSViz'>
        <div>
          <Header />
          <this.props.activeRouteHandler />
        </div>
      </DocumentTitle>
    )
  }
})

var routes = (
  <Routes location="hash">
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={MapPage}/>
      <NotFoundRoute handler={NotFound}/>
      <Route name="map" path="map" handler={MapPage}/>
      <Route name="data" path="data" handler={DataPage}/>
    </Route>
  </Routes>
)

if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React;
}

React.renderComponent(routes, document.body)
'use strict'

var React = require('react')
var DocumentTitle = require('react-document-title')
var Router = require('react-router')

var { DefaultRoute, Link, NotFoundRoute, Route, RouteHandler } = require('react-router')

// Pages
var DataPage = require('./pages/Data')
var MapPage = require('./pages/Map')
var NotFound = require('./pages/NotFound')

var App = React.createClass({

  displayName: 'App',

  render() {
    return (
      <DocumentTitle title='CSViz'>
        <RouteHandler />
      </DocumentTitle>
    )
  }
})

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={MapPage}/>
    <NotFoundRoute handler={NotFound}/>
    <Route name="map" path="map" handler={MapPage}/>
  </Route>
)

if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React
}

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.body)
})
'use strict'

var React = require('react')
var DocumentTitle = require('react-document-title')

var { DefaultRoute, Link, NotFoundRoute, Route, Routes } = require('react-router')

// Pages
var DataPage = require('./pages/Data')
var MapPage = require('./pages/Map')
var NotFound = require('./pages/NotFound')

var App = React.createClass({

  displayName: 'App',

  render() {
    return (
      <DocumentTitle title='CSViz'>
        <this.props.activeRouteHandler />
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
    </Route>
  </Routes>
)

if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React
}

React.render(routes, document.body)
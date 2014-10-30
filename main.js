/** @jsx React.DOM */
'use strict'

var React = require('react')
var Router = require('react-router')
var DocumentTitle = require('react-document-title')
var createStoreMixin = require('./mixins/createStoreMixin')
var MapActionCreators = require('./actions/MapActionCreators')

var CONFIGStore = require('./stores/CONFIGStore')

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

var App = React.createClass({

  displayName: 'App',

  mixins: [createStoreMixin(CONFIGStore)],

  getStateFromStores() {
    var config_data = CONFIGStore.get()

    return {
      config: config_data
    }
  },

  componentDidMount() {
    MapActionCreators.requestConfig()
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      MapActionCreators.requestConfig()
    }
  },

  render() {
    return (
      <DocumentTitle title='CSViz'>
        <div>
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
  window['React'] = React
}

React.renderComponent(routes, document.body)
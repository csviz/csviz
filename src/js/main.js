/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var github = require('./models/github.js');
var auth = require('./routes/auth.js');

// Pages
var Map = require('./map/map.js');
var Table = require('./table/table.js');
var NotFound = require('./statics/notfound.js');

// Router
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var ActiveState = Router.ActiveState;

var App = React.createClass({
  displayName: 'AppComponent',

  mixins: [auth, ActiveState],

  getInitialState: function() {
    return {
      meta: {},
      loggedIn: false,
      isTableActive: null
    };
  },

  updateActiveState: function () {
    // check if the current router is table or map
    // will see update from react-router
    this.setState({
      isTableActive: App.isActive('table', undefined, undefined)
    })
  },

  setStateOnAuth: function(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  },

  componentWillMount: function() {
    // get repo meta data
    github.getPublicRepo('fraserxu', 'csviz', function(err, data) {
      if(err) console.log('get repo meta err', err)
      this.setState({meta: data})
    }.bind(this))

    // check login
    if (!!window.localStorage.token) {
      this.setStateOnAuth(true)
    } else {
      this.setStateOnAuth(false)
    }
  },

  logout: function() {
    delete window.localStorage.token
    this.setStateOnAuth(false)
  },

  render: function() {
    var loginOrOut = this.state.loggedIn ?
      <button onClick={this.logout}>Logout</button> :
      <button><a href="http://csviz.dev.wiredcraft.com/token">Login</a></button>;

    var nav = this.state.isTableActive ?
      <span><Link to="map">Map</Link></span> :
      <span><Link to="table">Table</Link></span>;

    return (
      <div>
        <header>
          <span className='header'>
            <a href=''>
              <img className='logo' src='./dist/assets/images/logo.png' />
            </a>
            <span>{this.state.meta.description}</span>
            <a target='_blank' href={this.state.meta.html_url}>{this.state.meta.name}</a>
          </span>

          <span className="controls">
            {loginOrOut}
          </span>

          {nav}

        </header>

        <this.props.activeRouteHandler />
      </div>
    );
  }
});

var routes = (
  <Routes>
    <Route name="app" handler={App}>
      <Route name='map' path='/' handler={Map} />
      <Route name='table' path='/table' handler={Table} />
      <DefaultRoute handler={Map} />
    </Route>
    <NotFoundRoute name='notfound' handler={NotFound} />
  </Routes>
);

React.renderComponent(routes, document.body);

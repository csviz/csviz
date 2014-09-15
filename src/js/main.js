/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var github = require('./models/github.js');
var auth = require('./routes/auth');

// Pages
var Map = require('./map/map.js');
var Table = require('./table/table.js');
var NotFound = require('./statics/notfound.js');

// Router
var Routes = require('react-router/Routes');
var Route = require('react-router/Route');
var Link = require('react-router/Link');
var NotFoundRoute = require('react-router/NotFoundRoute');
var DefaultRoute = require('react-router/DefaultRoute');

var App = React.createClass({
  displayName: 'AppComponent',

  mixins: [auth],

  getInitialState: function() {
    return {
      meta: {},
      loggedIn: false
    };
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

  render: function() {
    var loginOrOut = this.state.loggedIn ?
      <button onClick={this.save}>Save</button> :
      <button><a href="http://csviz.dev.wiredcraft.com/token">Login</a></button>;

    return (
      <div>
        <header>
          <div className='header'>
            <a href=''>
              <img className='logo' src='./dist/assets/images/logo.png' />
            </a>
            <p>DESCRIPTION: {this.state.meta.description}</p>
            <a target='_blank' href={this.state.meta.html_url}>{this.state.meta.name}</a>
          </div>

          <nav>
            <ul>
              <li><Link to="table">Table</Link></li>
              <li><Link to="map">Map</Link></li>
            </ul>
          </nav>

          <div className="controls">
            {loginOrOut}
          </div>
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

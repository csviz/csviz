'use strict'

var _ = require('lodash')
var React = require('react')
var mui = require('material-ui')
var Paper = mui.Paper
var SearchBar = require('react-select')
var Router = require('react-router')

var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')
var Store = require('../stores/Store')

var Timeline = React.createClass({

  displayName: 'SearchBar',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  setStatusOnresize() {
    if (window.innerWidth > 768) {
      MapActionCreators.changeSearchStatus(true)
      MapActionCreators.changeLegendStatus(true)
    } else {
      MapActionCreators.changeLegendStatus(false)
      MapActionCreators.changeSearchStatus(false)
    }
  },

  componentWillMount() {
    this.setStatusOnresize()
    window.onresize = this.setStatusOnresize
  },

  componentDidMount() {
    Store.addCountryChangeListener(this.handleStoreChange)
    Store.addSearchChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  handleSearchChange(countryName) {
    if(_.contains(Object.keys(this.props.data.global.meta.locations), countryName)) {
      this.updateQuery({country: countryName})
      MapActionCreators.changeSelectedCountry(countryName)
    }
  },

  render() {
    var selected_country = Store.getSelectedCountry()
    var currentSearchStatus = Store.getSearchStatus()
    var SearchBarComponent
    var options = []

    if (currentSearchStatus && this.props.data.global) {

      options = Object.keys(this.props.data.global.meta.locations).map(function(country) {
        return { value: country, label: this.props.data.global.meta.locations[country].label}
      }.bind(this))

      SearchBarComponent = (<SearchBar
        name='country'
        options={options}
        onChange={this.handleSearchChange}
        value={ selected_country }
      />)

    }

    return (
      <div className='search'>
        {SearchBarComponent}
      </div>
    )
  }

})

module.exports = Timeline
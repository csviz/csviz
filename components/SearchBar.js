'use strict'

var React = require('react')
var mui = require('material-ui')
var Paper = mui.Paper
var SearchBar = require('react-select')

var MapActionCreators = require('../actions/MapActionCreators')
var _ = require('lodash')

var Timeline = React.createClass({

  displayName: 'SearchBar',

  handleSearchChange(countryName) {
    if(_.contains(Object.keys(this.props.data.global.meta.locations), countryName)) {
      MapActionCreators.changeSelectedCountry(countryName)
    }
  },

  render() {
    var SearchBarComponent
    var options = []

    if (this.props.data.global) {

      options = Object.keys(this.props.data.global.meta.locations).map(function(country) {
        return { value: country, label: this.props.data.global.meta.locations[country].label}
      }.bind(this))

      SearchBarComponent = (<SearchBar
        name='country'
        options={options}
        onChange={this.handleSearchChange}
        value={ null }
      />)

    }

    return (
      <div className='search-bar'>
        {SearchBarComponent}
      </div>
    )
  }

})

module.exports = Timeline
'use strict'

var _ = require('lodash')
var React = require('react')
var mui = require('material-ui')
var Paper = mui.Paper
var SearchBar = require('react-select')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Timeline = React.createClass({

  displayName: 'SearchBar',

  componentDidMount() {
    Store.addCountryChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  handleSearchChange(countryName) {
    if(_.contains(Object.keys(this.props.data.global.meta.locations), countryName)) {
      MapActionCreators.changeSelectedCountry(countryName)
    }
  },

  render() {
    var selected_country = Store.getSelectedCountry()
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
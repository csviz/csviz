'use strict'

var React = require('react')
var mui = require('material-ui')
var Paper = mui.Paper
var SearchBar = require('react-select')
var MapActionCreators = require('../actions/MapActionCreators')
var GLOBALStore = require('../stores/GLOBALStore')
var createStoreMixin = require('../mixins/createStoreMixin')
var _ = require('lodash')

var Timeline = React.createClass({

  displayName: 'SearchBar',

  mixins: [createStoreMixin(GLOBALStore)],

  getStateFromStores() {
    var global_data = GLOBALStore.get()
    var selected_country = GLOBALStore.getSelectedCountry()

    return {
      globals: global_data,
      selected_country: selected_country
    }
  },

  handleSearchChange(countryName) {
    if(_.contains(Object.keys(this.state.globals.meta.locations), countryName)) {
      console.log('countryName', countryName)
      MapActionCreators.changeSelectedCountry(countryName)
    }
  },

  render() {
    var SearchBarComponent
    var options = []
    var selected_country = this.state.selected_country

    if (this.state.globals.meta && selected_country) {

      options = Object.keys(this.state.globals.meta.locations).map(function(country) {
        return { value: country, label: this.state.globals.meta.locations[country].label}
      }.bind(this))

      SearchBarComponent = (<SearchBar
        name='country'
        options={options}
        onChange={this.handleSearchChange}
        value={selected_country}
      />)

    }

    return (
      <div className='search-bar'>
        <Paper>
          {SearchBarComponent}
        </Paper>
      </div>
    )
  }

})

module.exports = Timeline
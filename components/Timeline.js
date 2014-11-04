'use strict'

var React = require('react')
var MapActionCreators = require('../actions/MapActionCreators')
var GLOBALStore = require('../stores/GLOBALStore')
var createStoreMixin = require('../mixins/createStoreMixin')

var Timeline = React.createClass({

  displayName: 'Timeline',

  mixins: [createStoreMixin(GLOBALStore)],

  getStateFromStores() {
    var global_data = GLOBALStore.get()
    var selected_year = GLOBALStore.getSelectedYear()

    return {
      globals: global_data,
      selected_year: selected_year
    }
  },

  handleYearClick(e) {
    var selected_year = e.target.innerHTML
    MapActionCreators.changeSelectedYear(selected_year)
  },

  render() {
    return (
      <div className='card'>
        <ul className='timeline'>
          { this.state.globals.meta ?
              this.state.globals.meta.indicators.gdp.years.map(function(year, key) {
                return <li value={key} onClick={this.handleYearClick}>{year}</li>
              }.bind(this)) : null
          }
        </ul>
      </div>
    )
  }

})

module.exports = Timeline
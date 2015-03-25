'use strict'

var React = require('react')
var cx = React.addons.classSet
var Router = require('react-router')

var MapActionCreators = require('../actions/MapActionCreators')
var queryMixin = require('../mixins/queryMixin')

var GpeCountryList = React.createClass({

  displayName: 'GpeCountryList',

  mixins: [ Router.State, Router.Navigation, queryMixin ],

  onCountryClick(countryName) {
    this.updateQuery({country: countryName})
    MapActionCreators.changeSelectedCountry(countryName)
  },

  render() {
    var indicators = this.props.data.global.data.locations;
    var selected_country = this.props.selectedCountry;
    var selected_indicator = this.props.selectedIndicator;

    var countryList = Object.keys(indicators).map((countryName, key) => {
      var countryValue = indicators[countryName][selected_indicator];
      var formattedValue = countryValue ? 'DONOR' : 'DONEE';

      var classes = cx({
        'countryItem': true,
        'empty': !countryValue,
        'active': selected_country == countryName
      });

      return (
        <li key={key} className={classes}>
          <header onClick={this.onCountryClick.bind(this, countryName)}>
            <span className='label'>{this.props.data.global.meta.locations[countryName].label}</span>
            <span className='value'>{formattedValue}</span>
          </header>
        </li>
      )
    });

    return (
      <ul className='list'>
        { countryList }
      </ul>
    );
  }

})

module.exports = GpeCountryList

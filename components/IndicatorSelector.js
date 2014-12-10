'use strict'

var _ = require('lodash')
var React = require('react')

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var IndicatorSelector = React.createClass({

  displayName: 'IndicatorSelector',

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  hanldeSelectChange(e) {
    MapActionCreators.changeIndicator(e.target.value)
  },

  render() {
    var MenuItems, indicatorDescription
    var data = this.props.data
    var selected_indicator = Store.getSelectedIndicator()

    // after get the configs
    if (data.configs && data.configs.indicators) {
      var indicators = data.configs.indicators
      var MenuItems = Object.keys(indicators)
        .filter(key => indicators[key].name)
        .map(key => ({ payload: key, text: indicators[key].name }))
        .map((data, index) => (
          <option key={index} value={data.payload} defaultValue={selected_indicator === data.payload}>{data.text}</option>
        ))

      if (selected_indicator) {
        indicatorDescription = data.configs.indicators[selected_indicator].description
      } else {
        indicatorDescription = 'There\'s no description for this indicator.'
      }

    } else {
      MenuItems = null
    }

    return (
      <section className='indicator'>
        <header className='select'>
          <select onChange={this.hanldeSelectChange}>
            {MenuItems}
          </select>
        </header>
        <p className='description'>{indicatorDescription}</p>
      </section>
    )
  }

})

module.exports = IndicatorSelector
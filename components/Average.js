'use strict'

var _ = require('lodash')
var React = require('react')
var AdditiveAnimation = require('additive-animation')

var safeTraverse = require('../utils/safeTraverse')
var Store = require('../stores/Store')
var AverageHeader = require('./AverageHeader')
var GpeCountryList = require('./GpeCountryList')
var CountryList = require('./CountryList')

var Average = React.createClass({

  displayName: 'Average',

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    Store.addYearChangeListener(this.handleStoreChange)
    Store.addCountryChangeListener(this.handleCountryChange)

    this.setState({})
  },

  componentWillUpdate(prevProps, prevState) {
    var selectedCountryElement;
    var averageContainer = this.getDOMNode();

    if(averageContainer) {
      selectedCountryElement = averageContainer.querySelector('ul .countryItem.active')
    }

    if (!_.isUndefined(selectedCountryElement) && !_.isNull(selectedCountryElement)) {
      this.scrollToTop(selectedCountryElement.offsetTop)
    }
  },

  handleStoreChange() {
    this.setState({})
  },

  handleCountryChange() {
    this.handleStoreChange()
  },

  scrollToTop(offsetTop) {
    var drilldown = document.querySelector('.sidebar-panel')
    var toState = offsetTop - 106
    // need to include the scatterplot height
    var fromState = drilldown.scrollTop

    var animation = new AdditiveAnimation({
      enabledRAF: true,
      onRender: function(state) {
        drilldown.scrollTop = state.scrollTop
      }
    })

    animation.animate({scrollTop: fromState}, {scrollTop: toState}, 1000, 'easeInOutQuart')
  },

  render() {
    var global = this.props.data.global
    var configs = this.props.data.configs

    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    var selected_country = Store.getSelectedCountry()

    // return null if there's no data ready
    if(!selected_indicator || !global || !configs) return null

    return (
      <section className='drilldown'>
        { !safeTraverse(configs, 'indicators', selected_indicator, 'average') && !_.isEmpty(this.props.data) && selected_indicator &&
          <AverageHeader data={this.props.data} selectedIndicator={selected_indicator} selectedYear={selected_year} />
        }

        { selected_indicator === 'map_of_the_global_partnership_for_education' &&
          <GpeCountryList {...this.props} selectedIndicator={selected_indicator} selectedCountry={selected_country}/>
        }

        { selected_indicator != 'map_of_the_global_partnership_for_education' &&
          <CountryList {...this.props} selectedIndicator={selected_indicator} selectedCountry={selected_country} selectedYear={selected_year} />
        }
      </section>
    )
  }

})

module.exports = Average

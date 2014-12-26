'use strict'

var _ = require('lodash')
var React = require('react')
var Router = require('react-router')
var objectAssign = require('object-assign')
var cx = React.addons.classSet

var MapActionCreators = require('../actions/MapActionCreators')
var Store = require('../stores/Store')

var Timeline = React.createClass({

  displayName: 'Timeline',

  mixins: [ Router.State, Router.Navigation ],

  getInitialState() {
    return {
      isTimelinePlaying: false,
      playLoop: null
    }
  },

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)
    Store.addYearChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  componentWillUnmount() {
    if (this.state.playLoop) window.clearInterval(this.state.playLoop)
  },

  handleYearClick(e) {
    var selected_year = e.target.innerHTML
    var queries = this.getQuery()
    var _queries = objectAssign(queries, {year: selected_year})

    this.replaceWith('app', {}, _queries)

    MapActionCreators.changeSelectedYear(selected_year)
  },

  playTimeline() {
    var playLoop = this.state.playLoop
    var selected_indicator = Store.getSelectedIndicator()
    this.setState({ isTimelinePlaying: !this.state.isTimelinePlaying })

    if (this.state.isTimelinePlaying) {
      if (playLoop) window.clearInterval(playLoop)
      this.setState({ playLoop: null })
    } else if (!this.state.isTimelinePlaying) {
      playLoop = window.setInterval(function() {
        var current_year = Store.getSelectedYear()
        var current_year_index = _.indexOf(this.props.data.global.meta.indicators[selected_indicator].years, current_year)

        if (current_year_index == this.props.data.global.meta.indicators[selected_indicator].years.length - 1) {
          window.clearInterval(playLoop)
          this.setState({ isTimelinePlaying: false })
          playLoop = null
        } else {
          var next_year_index = current_year_index + 1
          var next_year = this.props.data.global.meta.indicators[selected_indicator].years[next_year_index]

          var queries = this.getQuery()
          var _queries = objectAssign(queries, {year: next_year})

          this.replaceWith('app', {}, _queries)
          MapActionCreators.changeSelectedYear(next_year)
        }
      }.bind(this), 600)
      this.setState({ playLoop: playLoop })
    }

  },

  render() {
    var TimelineBox, timeline, playButton
    var selected_indicator = Store.getSelectedIndicator()
    var selected_year = Store.getSelectedYear()
    if (this.props.data.global && selected_indicator && selected_year && this.props.data.configs.indicators[selected_indicator].years.length > 1) {
      timeline = this.props.data.global.meta.indicators[selected_indicator].years.map(function(year) {
        return <li key={year} value={year} className={ (year == selected_year) ? 'active' : null } onClick={this.handleYearClick}>{year}</li>
      }, this)

      var classes = cx({
        'action': true,
        'active': this.state.isTimelinePlaying
      })

      playButton = (
        <li className={classes} onClick={this.playTimeline}>
          <span>
            { this.state.isTimelinePlaying ?
              'Stop' :
              'Play'
            }
          </span>
        </li>
      )

      TimelineBox = (
        <ul>
          {playButton}
          {timeline}
        </ul>
      )
    }

    return (
      <div className='timeline'>
        {TimelineBox}
      </div>
    )
  }

})

module.exports = Timeline
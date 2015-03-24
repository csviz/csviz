'use strict'

var React = require('react')
var d3 = require('d3')
var numeral = require('numeral')
var MapUtils = require('../utils/MapUtils')
var _ = require('lodash')

var Store = require('../stores/Store')

var Scatterplot = React.createClass({
  getDefaultProps: function() {
    return {
      width: 450,
      height: 80,
      labelHeight: 20
    }
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.data) this.renderGraph(nextProps.data)
  },

  renderGraph: function(data) {
    var el = this.getDOMNode()
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    var width = this.props.width
    var height = this.props.height
    var labelHeight = this.props.labelHeight
    var selectedIndex = this.props.selectedIndex
    var onCircleClick = this.props.onCircleClick || (function() {})

    var xRangeStart = width/data.length/2 > height/2 ? height/2 : width/data.length/2

    var xScale = d3.scale.linear()
      .domain([0, data.length])
      .range([xRangeStart, width - xRangeStart])

    var rScale = d3.scale.linear()
      .domain([d3.min(data), d3.max(data)])
      .range([xScale(0)/2 - 10, xScale(0)/2 - 5])

    var svg = d3.select(this.getDOMNode())
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d, i) {
        return xScale(i)
      })
      .attr('cy', height/2)
      .attr('r', function(d) {
        return rScale(d)
      })
      .attr('fill', function(d, i) {

        if (d == 0) {
          return '#BBB'
        } else {
          var data = Store.getAll()
          var selected_indicator = Store.getSelectedIndicator()
          if (_.isEmpty(data) || _.isEmpty(selected_indicator)) return

          var configs = data.configs
          var meta = data.global.meta

          return MapUtils.getNumberColor(d, configs, meta, selected_indicator)
        }

      })
      .style('cursor', 'pointer')
      .on('mouseover', function(d) {
        if (d != 0) {
          d3.select(this)
            .attr('r', function(d) {
              return rScale(d) + 2
            })
        }
      })
      .on('mouseout', function(d) {
        if ( d!= 0) {
          d3.select(this)
            .transition()
            .delay(250)
            .attr('r', function(d) {
              return rScale(d)
            })
        }
      })
      .on('click', function(d, i) {
        d3.select(this).style('opacity', .8)
        onCircleClick(d, i)
      })

    var yearLabel = d3.select(this.getDOMNode())
      .append('svg')
      .attr('width', width)
      .attr('height', labelHeight)
      .append('g')

    yearLabel.selectAll('year-label')
      .data(data)
      .enter()
      .append('text')
      .text(function(d, i) {
        try {
          var _data = Store.getAll()
          var selected_indicator = Store.getSelectedIndicator()
          var meta = _data.global.meta.indicators
          var indicatorData = meta[selected_indicator]
        } catch (e) {
          console.error('get year from meta error', e)
        }
        return indicatorData.years[i]
      })
      .style('pointer-events', 'none')
      .attr('font-size', 12)
      .attr('fill', function(d, i) {
        if (selectedIndex === i) return '#4D4D4D'
        return '#BBB'
      })
      .style('font-weight', function(d, i) {
        if (selectedIndex === i) return 'bold'
      })
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', labelHeight)
      .attr('text-anchor', 'middle')

    var valueLabel = d3.select(this.getDOMNode())
      .append('svg')
      .attr('width', width)
      .attr('height', labelHeight)
      .append('g')

    valueLabel.selectAll('values')
      .data(data)
      .enter()
      .append('text')
      .text(function(d, i) {
        return numeral(d).format('0.0a')
      })
      .style('pointer-events', 'none')
      .attr('font-size', 12)
      .attr('fill', function(d, i) {
        if (selectedIndex === i) return '#4D4D4D'
        return '#BBB'
      })
      .style('font-weight', function(d, i) {
        if (selectedIndex === i) return 'bold'
      })
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', labelHeight)
      .attr('text-anchor', 'middle')


      // try to transform
      var x3 = (this.props.width - svg[0][0].getBoundingClientRect().width)/2
      var x0 = xScale(0)
      var r0 = rScale(data[0])
      var x1 = x0 - r0
      var x2 = x3 - x1

      svg.attr('transform', `translate(${x2}, 0)`)
      yearLabel.attr('transform', `translate(${x2}, 0)`)
      valueLabel.attr('transform', `translate(${x2}, 0)`)
  },

  render: function() {
    return React.createElement('div', null)
  }
})

module.exports = Scatterplot

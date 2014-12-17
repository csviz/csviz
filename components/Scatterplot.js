'use strict'

var React = require('react')
var d3 = require('d3')
var numeral = require('numeral')

var Scatterplot = React.createClass({
  getDefaultProps: function() {
    return {
      width: 350,
      height: 150,
      data: [15, 12, 25, 8, 20]
    }
  },

  componentDidMount: function() {
    this.renderGraph()
  },

  componentDidUpdate: function() {
    this.renderGraph()
  },

  render: function() {
    return React.createElement('div', null)
  },

  renderGraph: function() {
    var el = this.getDOMNode()
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    var width = this.props.width
    var height = this.props.height
    var data = this.props.data.slice()

    var xScale = d3.scale.linear()
      .domain([0, data.length])
      .range([height/2, width - height/2])

    var rScale = d3.scale.linear()
      .domain([d3.min(data), d3.max(data)])
      .range([5, height/4])

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
      .attr('fill', '#23D0EC')
      .style('opacity', .3)
      .on('mouseover', function() {
        d3.select(this)
          .style('opacity', .8)
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .delay(250)
          .style('opacity', .3)
      })

    svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(function(d) {
        return numeral(d).format('0.000')
      })
      .style('pointer-events', 'none')
      .attr('font-size', 10)
      .attr('fill', 'black')
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', height/2 + 5)
      .attr('text-anchor', 'middle')
  }
})

module.exports = Scatterplot
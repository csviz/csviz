'use strict'

var React = require('react')
var d3 = require('d3')

var BarchartEnvelope = React.createClass({
  getDefaultProps: function() {
    return {
      width: 700,
      height: 200,
      strokeColor: 'black',
      strokeWidth: '0.5px'
    }
  },

  componentWillReceiveProps(nextProps) {
    this.renderBarchart(nextProps)
  },

  renderBarchart: function(nextProps) {
    var el = this.getDOMNode()
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    var selectedIndex = this.props.selectedIndex
    var onCircleClick = this.props.onCircleClick || (function() {})

    var width = this.props.width
    var height = this.props.height
    var data = nextProps.data.map(function(value) {
      return parseFloat(value)
    })
    if (!data) return

    var xScale = d3.scale.linear()
      .domain([0, data.length])
      .range([2, width - 2])

    var yScale = d3.scale.linear()
      .domain(d3.extent(data))
      .range([height - 2, 2])

    var barchartScale = d3.scale.linear()
      .domain(d3.extent(data))
      .range([1, height - 1])

    var svg = d3.select(this.getDOMNode())
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', function(d) {
        if (d) {
          return height - barchartScale(d)
        } else {
          return height
        }
      })
      .attr('width', function() {
        return width / data.length - 5
      })
      .attr('height', function(d) {
        if (d) {
          return barchartScale(d)
        } else {
          return 0
        }
      })
      .attr('fill', function(d, i) {
        if (selectedIndex === i) return '#4D4D4D'
        return '#ccc'
      })
      .style('cursor', 'pointer')
      .on('click', function(d, i) {
        onCircleClick(d, i)
      })
  },

  render: function() {
    return React.createElement('div', null)
  }
})

module.exports = BarchartEnvelope

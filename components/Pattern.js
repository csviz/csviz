'use strict'

var React = require('react')
var d3 = require('d3')

var Pattern = React.createClass({

  componentDidMount: function() {
    this.generatePattern()
  },

  render: function() {
    return React.createElement('svg', null)
  },

  buildPath: function(data) {
    var gap = data.mw / data.steps
    var path = []
    for (var i = 0; i < data.steps; i++) {
      path.push('M0 ' + gap * (data.steps - i - 1) + ' l' + gap * (i + 1) + ',' + gap * (i + 1))
    }
    for (var i = 0; i < data.steps - 1; i++) {
      path.push('M' + gap * (i + 1) + ' 0 l' + gap * (data.steps - i - 1) + ',' + gap * (data.steps - i - 1))
    }
    return path
  },

  generatePattern: function() {
    var el = this.getDOMNode()
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    var data = {
      mw: 10,
      mh: 10,
      steps: 1
    }

    var paths = this.buildPath(data)
    var svg = d3.select(this.getDOMNode())
      .style({
        width: data.mw,
        height: data.mh,
        position: 'absolute',
        'z-index': -1
      })
      .append('defs')
      .append('pattern')
      .attr({
        height: data.mw,
        width: data.mh,
        y: 0,
        x: 0,
        patternUnits: 'userSpaceOnUse',
        id: 'fragilePattern'
      })
      .append('g')
      .style({
        fill: 'none',
        stroke: '#fff',
        'stroke-width': 1
      })

    svg.selectAll('path')
      .data(paths)
      .enter()
      .append('circle')
      .attr('cx', 1)
      .attr('cy', 1)
      .attr('r', 1)
  }
})

module.exports = Pattern

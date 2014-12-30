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

  generatePattern: function() {
    var el = this.getDOMNode()
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    var paths = ['M0 15 l5,5', 'M0 10 l10,10', 'M0 5 l15,15', 'M0 0 l20,20', 'M15 0 l5,5', 'M10 0 l10,10', 'M5 0 l15,15']
    var svg = d3.select(this.getDOMNode())
      .style({
        width: 300,
        height: 300
      })
      .append('defs')
      .append('pattern')
      .attr({
        height: 20,
        width: 20,
        y: 0,
        x: 0,
        patternUnits: 'userSpaceOnUse',
        id: 'fragilePattern'
      })
      .append('g')
      .style({
        fill: 'none',
        stroke: '#fff',
        'stroke-width': 2
      })

    svg.selectAll('path')
      .data(paths)
      .enter()
      .append('path')
      .attr('d', function(d) {
        return d
      })
  }
})

module.exports = Pattern
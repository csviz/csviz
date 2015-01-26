'use strict'

var React = require('react')

var ControlHeader = require('./ControlHeader')
var IndicatorSelector = require('./IndicatorSelector')
var SocialPanel = require('./SocialPanel')
var Average = require('./Average')

var MapControls = React.createClass({

  displayName: 'MapControls',

  hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className)
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
    }
  },

  addClass(el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      el.className += ' ' + className
    }
  },

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
  },

  toggleSidebar() {
    var body = document.querySelector('body')
    if(this.hasClass(body, 'isSidebarOpen')) {
      this.removeClass(body, 'isSidebarOpen')
    } else {
      this.addClass(body, 'isSidebarOpen')
    }

  },

  render() {
    return (
      <aside id='sidebar'>
        <div className='sidebar-toggle'>
          <button name='button' onClick={this.toggleSidebar}></button>
        </div>
        <div className='sidebar-panel'>
          <ControlHeader data={this.props.data} />
          <IndicatorSelector data={this.props.data} />
          <SocialPanel data={this.props.data} />
          <Average data={this.props.data} />
        </div>
      </aside>
    )
  }

})

module.exports = MapControls

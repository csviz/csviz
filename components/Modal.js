'use strict'

var React = require('react')

var Modal = React.createClass({
  displayName: "Modal",

  getInitialState () {
    return {
      visible: false
    }
  },

  getDefaultProps () {
    return {
      onShow(){},
      onHide(){}
    }
  },

  componentWillMount () {
    this.handleBeforeComponentUpdate(this.props)
  },

  componentWillUnmount () {
    this.__setBodyOverflowVisible(true)
  },

  componentWillReceiveProps (props) {
    this.handleBeforeComponentUpdate(props)
  },

  componentDidMount () {
    this.handleComponentUpdate(this.props, this.getInitialState())
  },

  componentDidUpdate (prevProps, prevState) {
    this.handleComponentUpdate(prevProps, prevState)
  },

  handleBeforeComponentUpdate (props) {
    if (props.hasOwnProperty('visible') && props.visible !== this.state.visible) {
      this.setState({
        visible: props.visible
      })
    }
  },

  handleComponentUpdate (prevProps, prevState) {
    if (prevState.visible !== this.state.visible) {
      if (this.state.visible) {
        this.props.onShow()
      } else {
        this.props.onHide()
      }
      this.__setBodyOverflowVisible(!this.state.visible)
    }
  },

  __setBodyOverflowVisible (visible) {
    if (!visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = null
    }
  },

  handleCloseBtnClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this.toggleVisibility()
  },

  handleOverlayClick (e) {
    if (e.target === this.refs.overlay.getDOMNode()) {
      e.preventDefault()
      e.stopPropagation()
      this.toggleVisibility()
    }
  },

  // called from the outside world
  toggleVisibility () {
    var visible = !this.state.visible
    this.setState({
      visible: visible
    })
  },

  // called from the outside world
  show () {
    this.setState({ visible: true })
  },

  // called from the outside world
  hide () {
    this.setState({ visible: false })
  },

  render () {
    return (
      React.DOM.div({
        className: "overlay"+ (this.state.visible ? "" : " hidden"),
        ref: "overlay",
        onClick: this.handleOverlayClick
      }, React.DOM.div({ className: "overlay-top" }, React.DOM.div({
          className: "overlay-close",
          title: "Close",
          onClick: this.handleCloseBtnClick
        }, "×")),

        React.DOM.div({ className: "overlay-content" }, this.props.children)))
  }
})

module.exports = Modal

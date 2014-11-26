'use strict'

var React = require('react')

var Spinner = React.createClass({

  displayName: 'Spinner',

  render() {

    return (
      <div className='react-spinner-container'>
        <svg className="react-spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle className="react-spinner-path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    )
  }

})

module.exports = Spinner
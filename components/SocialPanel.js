'use strict'

var React = require('react')
var mui = require('material-ui')
var PaperButton = mui.PaperButton
var Dialog = mui.Dialog

var SocialPanel = React.createClass({

  displayName: 'SocialPanel',

  _showDialog() {
    this.refs.shareDialog.show();
  },

  _download() {
    window.location = this.props.configs.data.globals
  },

  render() {
    var dialogActions = [
      { text: 'CANCEL' },
      { text: 'SUBMIT', onClick: this._onDialogSubmit }
    ]
    // var Download = this.props.configs.data ? <a href={this.props.configs.data.globals} download>Download</a> : null

    return (
      <div className='card'>

        <div className='social-panel'>

          <PaperButton label='Share' onClick={this._showDialog} />
          <PaperButton label='Download' onClick={this._download} />

        </div>

        <Dialog ref='shareDialog' title='Share' actions={dialogActions}>

          <p>Just copy and paste the URL below to share your visualization.</p>

          <textarea defaultValue={window.location.href}></textarea>

          <a href='https://twitter.com'>Twitter</a>
          <a href='https://facebook.com'>Facebook</a>
        </Dialog>
      </div>
    )
  }

});

module.exports = SocialPanel;
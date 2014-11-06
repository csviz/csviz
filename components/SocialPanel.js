'use strict'

var React = require('react')
var mui = require('material-ui')
var PaperButton = mui.PaperButton
var Dialog = mui.Dialog

var SocialPanel = React.createClass({

  displayName: 'SocialPanel',

  _showDialog: function() {
    this.refs.shareDialog.show();
  },

  render() {
    var dialogActions = [
      { text: 'CANCEL' },
      { text: 'SUBMIT', onClick: this._onDialogSubmit }
    ]
    var Download = this.props.configs.data ? <a href={this.props.configs.data.globals} download>Download</a> : null

    return (
      <div className='card'>

        <div className='social-panel'>

          <PaperButton label='Share' onClick={this._showDialog} />
          <Dialog ref='shareDialog' title='Share' actions={dialogActions}>

            <p>Just copy and paste the URL below to share your visualization.</p>

            <textarea defaultValue='http://datahub.globalpartnership.org/#/2010/domestic_and_external_financing/public_expenditure_on_education_as_a_share_of_public_expenditure'></textarea>

            <a href='https://twitter.com'>Twitter</a>
            <a href='https://facebook.com'>Facebook</a>
          </Dialog>

          {Download}
        </div>

      </div>
    )
  }

});

module.exports = SocialPanel;
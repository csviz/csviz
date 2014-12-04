'use strict'

var React = require('react')
var mui = require('material-ui')
var PaperButton = mui.PaperButton
var Dialog = mui.Dialog
var saveAs = require('filesaver.js')

var Store = require('../stores/Store')
var axios = require('axios')

var config = require('../config.json')
var globalPath = config.globalPath

var SocialPanel = React.createClass({

  displayName: 'SocialPanel',

  componentDidMount() {
    Store.addIndicatorChangeListener(this.handleStoreChange)

    this.setState({})
  },

  handleStoreChange() {
    this.setState({})
  },

  getInitialState: function() {
    return {
      shareContent: window.location.href
    };
  },

  _showDialog() {
    this.refs.shareDialog.show();
  },

  _download() {
    var selected_indicator = Store.getSelectedIndicator()
    var source_path = this.props.data.global.meta.indicators[selected_indicator].source_file

    var csv_url = `./data/${source_path}`
    axios.get(csv_url).then(function(res) {
      saveAs(new Blob([res.data], {
        type: 'text/plain;charset=utf-8'
      }), source_path)
    })
  },

  _setShareContent(event, value) {
    this.setState({shareContent: event.target.value})
  },

  _shareOnTwitter() {
    var twitter_url = 'https://twitter.com/share?url=' + encodeURIComponent(this.state.shareContent) + '&text=' + encodeURIComponent(this.state.shareContent) + '&via=csviz'

    window.open(twitter_url, 'Share via Twitter', 'width=600,height=400,resizable,scrollbars,status')
  },

  _shareOnFacebook() {
    var facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.state.shareContent)

    window.open(facebook_url, 'Share via Facebook', 'width=600,height=400,resizable,scrollbars,status')
  },

  render() {
    var dialogActions = [
      { text: 'CLOSE' }
    ]

    return (
      <div className='card'>
        <div className='social-panel-box'>

          <PaperButton icon='social-share' label='Share' onClick={this._showDialog} />
          <PaperButton icon='file-cloud-download' label='Download' onClick={this._download} />

        </div>

        <Dialog className='share-dialog-box' ref='shareDialog' title='Share' actions={dialogActions}>

          Just copy and paste the URL below to share your visualization.

          <textarea
            onChange={this._setShareContent}
            value={this.state.shareContent}
            rows="5"
            cols="80"
          />

          <div className='share-dialog-links'>
            <PaperButton label='Share on Twitter' onClick={this._shareOnTwitter} />
            <PaperButton label='Share on Facebook' onClick={this._shareOnFacebook} />
          </div>

        </Dialog>

      </div>
    )
  }

});

module.exports = SocialPanel;
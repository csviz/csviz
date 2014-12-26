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
      shareContent: window.location.href,
      iframeOpen: false,
    };
  },

  getShareContent() {
    var selected_indicator = Store.getSelectedIndicator() || ''
    var selected_year = Store.getSelectedYear() || ''
    return `${selected_indicator} for ${selected_year} via @gpforeducation ${window.location.href}`
  },

  _showDialog() {
    var content = this.getShareContent()
    this.setState({
      shareContent: content,
    })
    this.refs.shareDialog.show()
  },

  _download() {
    var selected_indicator = Store.getSelectedIndicator()
    var source_path = encodeURIComponent(this.props.data.global.meta.indicators[selected_indicator].source_file)

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

  _shareOnGooglePlus() {
    var google_url = `https://plus.google.com/share?url=${window.location.href}`
    window.open(google_url, 'Share via Google+', 'width=600,height=400,resizable,scrollbars,status')
  },

  _toggleIframe() {
    this.setState({iframeOpen: !this.state.iframeOpen})
  },

  _buildIframeCode() {
    return `<iframe width="400" height="800" frameborder="0" scrolling="y" marginheight="0" marginwidth="0" src="${window.location.href}"></iframe>`
  },

  _focusOnInput(e) {
    var input = e.target
    input.focus()
    input.select()
  },

  render() {
    var dialogActions = [
      { text: '×' }
    ]

    var iframeUrl = this._buildIframeCode()
    var iframeBody = this.state.iframeOpen ? (
      <div className='body'>
        <textarea ref='iframeInput' type="text" className="iframe-copy" readOnly value={iframeUrl} autofocus onClick={this._focusOnInput} ></textarea>
      </div>
    ) : null

    return (
      <section className='links'>
        <PaperButton className='share' label='Share' onClick={this._showDialog} />
        <PaperButton className='download' label='Download' onClick={this._download} />

        <Dialog className='share-dialog-box' ref='shareDialog' title='Share' actions={dialogActions}>
          <span className="share-dialog-box-title">Just copy and paste the URL below to share your visualization.</span>
          <textarea
            onChange={this._setShareContent}
            value={this.state.shareContent}
            rows="5"
            cols="80"
          />
          <div className='share-dialog-links'>
            <PaperButton label='Twitter' onClick={this._shareOnTwitter} />
            <PaperButton label='Facebook' onClick={this._shareOnFacebook} />
            <PaperButton label='Google+' onClick={this._shareOnGooglePlus} />
          </div>
          <div className='iframe'>
            <span onClick={this._toggleIframe} className="add-to-website">Add to your website?</span>
            {iframeBody}
          </div>
        </Dialog>
      </section>
    )
  }

});

module.exports = SocialPanel;
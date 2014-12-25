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

  getShareContent() {
    var selected_indicator = Store.getSelectedIndicator() || ''
    var selected_year = Store.getSelectedYear() || ''
    return `${selected_indicator} for ${selected_year} via @gpforeducation ${window.location.href}`
  },

  _showDialog() {
    var content = this.getShareContent()
    this.setState({shareContent: content})
    this.refs.shareDialog.show()
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

  _shareOnGooglePlus() {
    var google_url = `https://plus.google.com/share?url=${window.location.href}`
    window.open(google_url, 'Share via Google+', 'width=600,height=400,resizable,scrollbars,status')
  },

  render() {
    var dialogActions = [
      { text: 'CLOSE' }
    ]

    return (
      <section className='links'>
        <PaperButton className='share' label='Share' onClick={this._showDialog} />
        <PaperButton className='download' label='Download' onClick={this._download} />

        <Dialog className='share-dialog-box' ref='shareDialog' title='Share' actions={dialogActions}>
          Just copy and paste the URL below to share your visualization.
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
        </Dialog>
      </section>
    )
  }

});

module.exports = SocialPanel;
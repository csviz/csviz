/**
 * @jsx React.DOM
 */

var React = require('react')
var Modal = require('./Modal')

var SocialPanel = React.createClass({

  displayName: 'SocialPanel',

  getInitialState: function() {
    return {
      shareModalOpen: false
    };
  },

  share() {
    this.toggleShareModal()
  },

  toggleShareModal() {
    this.setState({shareModalOpen: !this.state.shareModalOpen})
  },

  download() {
    console.log('download button clicked')
  },

  onModalShow() {
    // this.toggleShareModal()
  },

  onModalHide() {
    this.toggleShareModal()
  },

  render() {
    return (
      <div className='social-panel card'>
        <Modal
          visible={this.state.shareModalOpen}
          onShow={this.onModalShow}
          onHide={this.onModalHide}
        >
          <header>
            <h1>Share</h1>
          </header>

          <p>Just copy and paste the URL below to share your visualization.</p>

          <textarea defaultValue='http://datahub.globalpartnership.org/#/2010/domestic_and_external_financing/public_expenditure_on_education_as_a_share_of_public_expenditure'></textarea>

          <a href='https://twitter.com'>Twitter</a>
          <a href='https://facebook.com'>Facebook</a>
        </Modal>


        <button onClick={this.toggleShareModal}>Share</button>
        <button onClick={this.download}>Download</button>
      </div>
    )
  }

});

module.exports = SocialPanel;
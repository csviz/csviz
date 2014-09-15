var xhr = require('xhr')

var API_URL = 'https://api.github.com'

module.exports = {
  getPublicRepo: function(owner, repo, cb) {
    xhr({responseType: 'json', url: API_URL + '/repos/' + owner + '/' + repo}, function(err, resp, data) {
      if(err) cb(err)
      cb(null, data)
    })
  }
}
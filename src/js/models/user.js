var Promise = require('es6-promise').Promise;
var xhr = require('xhr');

function User() {}

User.prototype.get = function() {
  this.token(window.localStorage.getItem('token'))
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!self._token)
      return reject(new Error('401'));
    xhr({
      uri: 'http://csviz.dev.wiredcraft.com/user',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + self._token
      }
    },
    function(err, resp, body) {
      if(err) {
        self.clear()
        return reject(err);
      }
      if (resp.statusCode === 200) {
        try {
          var attrs = JSON.parse(body)
        } catch (e) {
          return reject(e)
        }
        self.attrs = attrs
      }
      resolve(resp);
    });
  });
}

User.prototype.token = function(token) {
  if (!token) return this._token;
  this._token = token;
  return this;
}

User.prototype.save = function () {
  if(this._token) window.localStorage.setItem('token', this._token);
  return this;
}

User.prototype.clear =
User.prototype.logout = function() {
  this._token = null;
  this.attrs = null
  window.localStorage.clear();
  return this;
}

User.prototype.loggedIn = function() {
  return !!window.localStorage.token
}

module.exports = exports._user || (exports._user = new User())

exports.user = new User()

exports.User = User

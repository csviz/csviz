var Promise = require('es6-promise').Promise,
    xhr = require('xhr');

function User() {
}

User.prototype.get = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (!self.token)
            return reject(new Error('401'));
        xhr({
                uri: 'http://127.0.0.1:3000/user',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + self.token
                }
            },
            function(err, resp, body) {
                if(err || resp.statusCode === 401)
                    return reject(err || new Error('401'));
                resolve(body);
            });
    });
}

User.prototype.token = function(token) {
    if (!token)
        return this.token;
    this.token = token;
    return this;
}

User.prototype.save = function () {
    if(this.token)
        window.localStorage.setItem('token', this.token);
    return this;
}

User.prototype.clear = function() {
    this.token = null;
    this.attrs = null
    window.localStorage.clear();
    return this;
}


module.exports = exports._user || (exports._user = new User())

exports.user = new User()

exports.User = User

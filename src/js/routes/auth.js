var user = require('../models/user')

var authenticatedRoute = {
    statics: {
        willTransitionTo: function(transition) {
            if(user.attrs) return

            return user.get().then(function(data) {
                if (!session.isLogin()) {
                    if(transition.path !== '/')
                        transition.redirect('/')
                }

            }, function(err) {

            })
        }
    }
}

module.exports = authenticatedRoute

let path = require('path')

exports.getSignUp = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(`/users/${req.user.username}`)
  } else {
    res.sendFile(path.join(req.viewPath, 'signup.html'))
  }
}

exports.setupUser = function (req, res) {
  res.cookie('username', req.user.username)
  res.redirect(`/users/${req.user.username}`)
}

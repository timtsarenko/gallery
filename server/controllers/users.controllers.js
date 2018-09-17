let path = require('path')

exports.userOnly = function (req, res, next) {
  // only allow user to access user related pages
  if (req.isAuthenticated()) {
    req.user.username === req.params.userId ? next() : res.redirect('/')
  } else {
    res.redirect('/')
  }
}

exports.getUser = function (req, res) {
  res.sendFile(path.join(req.viewPath, 'user.html'))
}

exports.getSettings = function (req, res) {
  res.sendFile(path.join(req.viewPath, 'settings.html'))
}

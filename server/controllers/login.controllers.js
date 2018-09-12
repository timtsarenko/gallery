let path = require('path')

exports.getLogin = function (req, res) {
  // req.flash('error') contains our error message if failed to authenticate
  if (req.isAuthenticated()) {
    res.redirect(`/users/${req.user.username}`)
  } else {
    res.sendFile(path.join(req.viewPath, 'login.html'))
  }
}

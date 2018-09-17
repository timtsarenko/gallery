let path = require('path')

exports.getIndex = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(`/users/${req.user.username}`)
  } else {
    res.sendFile(path.join(req.viewPath, 'index.html'))
  }
}

let path = require('path')

exports.getLogin = function (req, res) {
  // req.flash('error') contains our error message if failed to authenticate
  res.sendFile(path.join(req.viewPath, 'login.html'))
}

exports.logOut = function (req, res) {
  req.logout()
  res.redirect('/')
}

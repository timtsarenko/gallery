exports.logOut = function (req, res) {
  // logout will remove req.user property and clear the login session if any
  req.logout()
  res.clearCookie('username')
  res.redirect('/')
}

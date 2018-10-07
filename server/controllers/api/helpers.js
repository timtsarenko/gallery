exports.allowAuthorized = function (req, res, next) {
  if (!req.isAuthenticated()) { res.send(401) }
  if (req.user.admin || (req.user.username === req.params.userId)) {
    next()
  } else {
    res.send(401)
  }
}

exports.adminOnly = function (req, res, next) {
  if (!req.isAuthenticated()) { res.send(401) }
  req.user.admin ? next() : res.send(401)
}

let User = require('mongoose').model('User')

exports.adminOnly = function (req, res, next) {
  req.user.admin ? next () : res.send(401)
}

exports.allowAuthorized = function (req, res, next) {
  if(req.user.admin || (req.user.username === req.params.userId)) {
    next()
  } else {
    res.send(401)
  }
}

exports.getUsers = function (req, res) {
  res.send(404)
}

exports.getUser = function (req, res) {
  User
    .findOne({ username: req.params.userId })
    .select('username email')
    .lean()
    .exec(function (err, user) {
      if (err) { return err }
      res.json(user)
    })
}

// exports.updateUser = function (req, res) { }

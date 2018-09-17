let User = require('mongoose').model('User')

exports.getUsers = function (req, res) {
  if (req.isAuthenticated()) {
    res.send(404)
  } else {
    res.send(401)
  }
}

exports.getUser = function (req, res) {
  if (req.isAuthenticated()) {
    if (!(req.user.username === req.params.userId)) {
      res.send(401)
    } else {
      User
        .findOne({ username: req.params.userId })
        .select('username email')
        .lean()
        .exec(function (err, user) {
          if (err) { return err }
          res.json(user)
        })
    }
  } else {
    res.send(401)
  }
}

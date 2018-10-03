let User = require('mongoose').model('User')

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

// [USERS]
exports.readUsers = function (req, res) {
  User.find({}, 'username email admin', { lean: true }, function (err, users) {
    if (err) { return err }
    res.json(users)
  })
}

// [USER]
//
// Don't allow admin to be set through user creation
// only an admin may update a user to admin afterwards
exports.createUser = function (req, res) {
  let form = req.body

  if (form.username == null || form.email == null || form.password == null) {
    res.send(400)
  } else {
    let newUser = new User({
      username: form.username,
      email: form.email,
      password: form.password
    })

    newUser.save(function (err) {
      err ? res.send(400) : res.json(newUser)
    })
  }
}

exports.readUser = function (req, res) {
  User.findOne(
    { username: req.params.userId },
    'username email admin',
    { lean: true },
    function (err, user) {
      if (err) { return err }
      res.json(user)
    }
  )
}

exports.updateUser = function (req, res) {
  let query = User.findOneAndUpdate(
    { username: req.params.userId },
    { $set: req.body },
    { new: true, runValidators: true, context: 'query' }
  )

  if (req.body.admin == null || (req.body.admin && req.user.admin)) {
    query.exec(function (err, user) {
      if (err) { res.json(err) }
      res.json(user)
    })
  } else {
    res.send(401)
  }
}

exports.deleteUser = function (req, res) {
  User.deleteOne({ username: req.params.userId }, function (err) {
    if (err) { res.json(err) }
    res.send(200)
  })
}

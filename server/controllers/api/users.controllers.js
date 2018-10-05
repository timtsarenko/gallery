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
exports.readUsers = function (req, res, next) {
  User.find({}, 'username email admin', { lean: true }, function (err, users) {
    err ? next(err) : res.json(users)
  })
}

// [USER]
//
// Don't allow admin to be set through user creation
// only an admin may update a user to admin afterwards
exports.createUser = function (req, res, next) {
  let form = req.body

  if (form.username == null || form.email == null || form.password == null) {
    res.send(400) // due to bad request
  } else {
    let newUser = new User({
      username: form.username,
      email: form.email,
      password: form.password
    })

    newUser.save(function (err) {
      if (err) {
        !(err.name == null) && err.name === 'ValidationError'
          ? res.send(400) : next(err)
      } else {
        res.json(newUser)
      }
    })
  }
}

exports.readUser = function (req, res, next) {
  User.findOne(
    { username: req.params.userId },
    'username email admin',
    { lean: true },
    (err, user) => { err ? next(err) : res.json(user) }
  )
}

exports.updateUser = function (req, res, next) {
  let query = User.findOneAndUpdate(
    { username: req.params.userId },
    { $set: req.body },
    { new: true, runValidators: true, context: 'query' }
  )

  // execute if admin parameter not included, or it is and action done by an admin
  if (req.body.admin == null || (req.body.admin && req.user.admin)) {
    query.exec((err, user) => {
      if (err) {
        !(err.name == null) && err.name === 'ValidationError'
          ? res.send(400) : next(err)
      } else {
        res.json(user)
      }
    })
  } else {
    res.send(401)
  }
}

exports.deleteUser = function (req, res, next) {
  User.deleteOne({ username: req.params.userId }, function (err) {
    err ? next(err) : res.send(200)
  })
}

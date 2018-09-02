let LocalStrategy = require('passport-local').Strategy
let User = require('mongoose').model('User')

module.exports = function () {
  let strategy = new LocalStrategy(function (username, password, done) {
    let query = User.findOne({ username: username })

    query.exec(function (err, user) {
      if (err) { return done(err) }

      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }

      return done(null, user)
    })
  })

  return strategy
}

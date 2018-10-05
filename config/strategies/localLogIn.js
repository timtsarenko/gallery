let LocalStrategy = require('passport-local').Strategy
let User = require('mongoose').model('User')

module.exports = function () {
  let strategy = new LocalStrategy(function (username, password, done) {
    let query = User.findOne({ username: username })

    query.exec(function (err, user) {
      // server exception error, handled by express with HTTP 500 response
      if (err) { return done(err) }

      // authentication failure (normal behavior)
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }

      // authentication succeeds and passes along instance of user
      return done(null, user)
    })
  })

  return strategy
}

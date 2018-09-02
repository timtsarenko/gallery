let passport = require('passport')
let User = require('mongoose').model('User')
let localLogInStrategy = require('./strategies/localLogIn.js')()
let localSignUpStrategy = require('./strategies/localSignUp.js')()

module.exports = function () {
  // store user.id in session
  passport.serializeUser(function (user, done) {
    done(null, user.id) // id is a virtual for _id
  })

  // retrieve user info from user.id in session
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  passport.use('local-login', localLogInStrategy)
  passport.use('local-signup', localSignUpStrategy)
}

let LocalStrategy = require('passport-local').Strategy
let User = require('mongoose').model('User')

module.exports = function () {
  let strategy = new LocalStrategy({ passReqToCallback: true },
    function (req, username, password, done) {
      // omit admin, otherwise user may pass a form with admin bool and that's no bueno
      let newUser = new User({
        username: username,
        email: req.body.email,
        password: password
      })

      newUser.save(function (err) {
        if (err) {
          // if validation error due to non-unique value: return as flash message
          return !(err.name == null) && err.name === 'ValidationError'
            ? done(null, false, { message: err.message }) : done(err)
        }
        return done(null, newUser)
      })
    })

  return strategy
}

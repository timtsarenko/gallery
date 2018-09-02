let LocalStrategy = require('passport-local').Strategy
let User = require('mongoose').model('User')

module.exports = function () {
  let strategy = new LocalStrategy({ passReqToCallback: true },
    function (req, username, password, done) {
      let newUser = new User({
        username: username,
        email: req.body.email,
        password: password,
        age: req.body.age
      })

      newUser.save(function (err) {
        if (err) { // non-unique cases will return an error here thanks to uniqueValidator
          return done(null, false, { message: err })
        }

        return done(null, newUser)
      })
    })

  return strategy
}

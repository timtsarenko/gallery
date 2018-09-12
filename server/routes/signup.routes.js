let path = require('path')
let express = require('express')
let passport = require('passport')

module.exports = function () {
  let router = express.Router()

  router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect(`/users/${req.user.username}`)
    } else {
      res.sendFile(path.join(req.viewPath, 'signup.html'))
    }
  })

  router.post('/',
    passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }),
    function (req, res) { res.redirect(`/users/${req.user.username}`) }
  )

  return router
}

let path = require('path')
let express = require('express')
let router = express.Router()
let passport = require('passport')

router.get('/', function (req, res) {
  // req.flash('error') contains our error message if failed to authenticate
  res.sendFile(path.join(req.viewPath, 'login.html'))
})

router.post('/',
  passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    res.redirect(`/users/${req.user.username}`)
  }
)

module.exports = router

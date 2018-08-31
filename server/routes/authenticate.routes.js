let path = require('path')
let express = require('express')
let router = express.Router()
let passport = require('passport')

router.get('/', function (req, res) {
  res.sendFile(path.join(req.viewPath, 'authenticate.html'))
})

router.post('/', passport.authenticate('local'),
  function (req, res) {
    res.redirect(`/users/${req.user.username}`)
  }
)

module.exports = router

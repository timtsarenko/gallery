let path = require('path')
let express = require('express')
let router = express.Router()

// only allow user to access user related pages
let userOnly = function (req, res, next) {
  if (req.isAuthenticated()) {
    req.user.username === req.params.userId ? next() : res.redirect('/')
  } else {
    res.redirect('/')
  }
}

router.get('/:userId', userOnly, function (req, res) {
  res.sendFile(path.join(req.viewPath, 'user.html'))
})

router.get('/:userId/settings', userOnly, function (req, res) {
  res.sendFile(path.join(req.viewPath, 'settings.html'))
})

module.exports = router

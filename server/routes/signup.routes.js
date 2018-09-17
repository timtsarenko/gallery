let express = require('express')

module.exports = function (passport) {
  let router = express.Router()
  let controller = require('../controllers/signup.controllers.js')

  router.get('/', controller.getSignUp)

  router.post('/',
    passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }),
    controller.setupUser
  )

  return router
}

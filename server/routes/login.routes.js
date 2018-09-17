let express = require('express')

module.exports = function (passport) {
  let router = express.Router()
  let controller = require('../controllers/login.controllers.js')

  router.get('/', controller.getLogin)

  router.post('/',
    passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }),
    controller.setupUser
  )

  return router
}

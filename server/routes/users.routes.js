let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../controllers/users.controllers.js')

  router.get('/:userId', controller.userOnly, controller.getUser)
  router.get('/:userId/settings', controller.userOnly, controller.getSettings)

  return router
}

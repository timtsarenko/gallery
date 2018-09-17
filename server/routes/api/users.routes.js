let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../../controllers/api/users.controllers.js')

  router.get('/', controller.getUsers)
  router.get('/:userId', controller.getUser)

  return router
}

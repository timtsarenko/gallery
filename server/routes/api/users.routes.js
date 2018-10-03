let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../../controllers/api/users.controllers.js')

  // [USERS]
  router.get('/', controller.adminOnly, controller.readUsers)

  // [USER]
  router.post('/:userId', controller.createUser)
  router.get('/:userId', controller.allowAuthorized, controller.readUser)
  router.put('/:userId', controller.allowAuthorized, controller.updateUser)
  router.delete('/:userId', controller.allowAuthorized, controller.deleteUser)

  return router
}

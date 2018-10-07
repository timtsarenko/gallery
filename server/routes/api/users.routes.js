let express = require('express')
let galleries = require('./galleries.routes.js')

module.exports = function () {
  let router = express.Router()
  let controller = require('../../controllers/api/users.controllers.js')
  let helpers = require('../../controllers/api/helpers.js')

  // [USERS]
  router.get('/', helpers.adminOnly, controller.readUsers)

  // [USER]
  router.post('/:userId', controller.createUser)
  router.get('/:userId', helpers.allowAuthorized, controller.readUser)
  router.put('/:userId', helpers.allowAuthorized, controller.updateUser)
  router.delete('/:userId', helpers.allowAuthorized, controller.deleteUser)

  // [GALLERY]
  router.use('/:userId/galleries', galleries())

  return router
}

let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../../controllers/api/users.controllers.js')

  //router.use('/', controller.adminOnly)
  router.get('/', controller.adminOnly, controller.getUsers)
  // router.put('/', controller.updateUsers)

  // Should post router be called
  // from our SignUp passport strategy?

  //router.use('/:userId', controller.authorizedOnly)
  router.get('/:userId', controller.allowAuthorized, controller.getUser)
  // router.put('/:userId', controller.updateUser)

  return router
}

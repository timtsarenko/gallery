let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../controllers/logout.controllers.js')

  router.get('/', controller.logOut)

  return router
}

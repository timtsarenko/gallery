let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../controllers/index.controllers.js')

  router.get('/', controller.getIndex)

  return router
}

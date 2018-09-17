let express = require('express')

module.exports = function () {
  let router = express.Router()
  let controller = require('../controllers/galleries.controllers.js')

  router.get('/:galleryId', controller.getGallery)

  return router
}

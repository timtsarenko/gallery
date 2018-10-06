let express = require('express')
let artworks = require('./artworks.routes.js')

module.exports = function () {
  let router = express.Router()
  // let controller = require('../../controllers/api/galleries.controllers.js')

  router.use('/:galleryId/artworks', artworks())

  return router
}

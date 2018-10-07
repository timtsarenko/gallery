let express = require('express')
let artworks = require('./artworks.routes.js')

module.exports = function () {
  let router = express.Router({mergeParams: true})
  let controller = require('../../controllers/api/galleries.controllers.js')
  let helpers = require('../../controllers/api/helpers.js')

  // [GALLERIES]
  router.get('/', helpers.adminOnly, controller.readGalleries)

  // [GALLERY]
  router.post('/:galleryId', controller.createGallery)
  router.get('/:galleryId', helpers.allowAuthorized, controller.readGallery)
  // router.put('/:galleryId', helpers.allowAuthorized, controller.updateGallery)
  router.delete('/:galleryId', helpers.allowAuthorized, controller.deleteGallery)  
  
  // [ARTWORKS]
  router.use('/:galleryId/artworks', artworks())

  return router
}

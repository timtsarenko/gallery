let path = require('path')
let express = require('express')

module.exports = function () {
  let router = express.Router()

  router.get('/:galleryId', function (req, res) {
    res.sendFile(path.join(req.viewPath, 'gallery.html'))
  })

  return router
}

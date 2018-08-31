let path = require('path')
let express = require('express')
let router = express.Router()

router.get('/:galleryId', function (req, res) {
  res.sendFile(path.join(req.viewPath, 'gallery.html'))
})

module.exports = router

const path = require('path')
const express = require('express')
let router = express.Router()

router.get('/:galleryid', function (req, res) {
  res.sendFile(path.join(req.viewPath, 'gallery.html'))
})

module.exports = router

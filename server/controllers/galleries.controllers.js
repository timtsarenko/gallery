let path = require('path')

exports.getGallery = function (req, res) {
  res.sendFile(path.join(req.viewPath, 'gallery.html'))
}

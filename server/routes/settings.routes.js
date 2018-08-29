const path = require('path')
const express = require('express')
let router = express.Router()

router.get('/', function (req, res) {
  res.sendFile(path.join(req.viewPath, 'settings.html'))
})

module.exports = router

const path = require('path')
const express = require('express')
let router = express.Router()

router.get('/:userid', function (req, res) {
  res.sendFile(path.join(req.viewPath, 'user.html'))
})

module.exports = router

let path = require('path')
let express = require('express')
let router = express.Router()

router.get('/:userId', function (req, res) {
  if (req.user.username === req.params.userId) {
    res.sendFile(path.join(req.viewPath, 'user.html'))
  } else {
    res.redirect('/authenticate')
  }
})

module.exports = router

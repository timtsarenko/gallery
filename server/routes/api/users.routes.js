let express = require('express')

module.exports = function () {
  let router = express.Router()

  router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.send(404)
    } else {
      res.send(401)
    }
  })

  return router
}

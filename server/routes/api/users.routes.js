let express = require('express')
let User = require('mongoose').model('User')

module.exports = function () {
  let router = express.Router()

  router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.send(404)
    } else {
      res.send(401)
    }
  })

  router.get('/:userId', function (req, res) {
    if (req.isAuthenticated()) {
      if (!(req.user.username === req.params.userId)) {
        res.send(401)
      } else {
        User
          .findOne({ username: req.params.userId })
          .select('username email age')
          .lean()
          .exec(function (err, user) {
            if (err) { return err }
            res.json(user)
          })
      }
    } else {
      res.send(401)
    }
  })

  return router
}

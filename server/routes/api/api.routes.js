let express = require('express')
let users = require('./users.routes.js')
let galleries = require('./galleries.routes.js')

module.exports = function () {
  let router = express.Router()

  router.use('/users', users())
  router.use('/galleries', galleries())

  return router
}

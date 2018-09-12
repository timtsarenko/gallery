let express = require('express')
let users = require('./users.routes.js')
// let galleries = require('./galleries.routes.js')
// let artworks = require('./artworks.routes.js')

module.exports = function () {
  let router = express.Router()

  router.use('/users', users())
  // router.use('/galleries', galleries())
  // router.use('/artworks', artworks()

  return router
}

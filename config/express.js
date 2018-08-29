const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

module.exports = function () {
  let app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use(function (req, res, next) {
    req.viewPath = path.join(__dirname, '../client/views')
    next()
  })

  app.use(express.static('./build'))
  app.use(express.static('./client/img'))

  require('../server/routes/main.routes.js')(app)

  return app
}

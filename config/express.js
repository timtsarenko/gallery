const express = require('express')
const bodyParser = require('body-parser')

module.exports = function() {
  let app = express()

  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  //TODO: handle based on node_env
  app.use(express.static('./build'))
  app.use(express.static('./client'))

  require('../server/routes/main.routes.js')(app)

  return app
}

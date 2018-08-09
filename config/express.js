const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

module.exports = function () {
  let app = express()

  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  // don't need to use a view engine, just plain html
  // so just assigning absolute path in express for convenience
  app.set('viewPath', path.join(__dirname, '../client/views'))

  // TODO: handle based on node_env
  app.use(express.static('./build'))
  app.use(express.static('./client/img'))

  require('../server/routes/main.routes.js')(app)

  return app
}

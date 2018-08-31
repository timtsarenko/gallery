let path = require('path')
let express = require('express')
let session = require('express-session')
let bodyParser = require('body-parser')
let passport = require('passport')

module.exports = function () {
  let app = express()

  // static files and html
  app.use(express.static('./build'))
  app.use(express.static('./client/img'))
  app.use(function (req, res, next) {
    req.viewPath = path.join(__dirname, '../client/views')
    next()
  })

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session for new request if session values haven't changed
    saveUninitialized: false // don't save sessions that are initialized but unpopulated
  }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(passport.session())

  require('../server/routes/main.routes.js')(app)

  return app
}

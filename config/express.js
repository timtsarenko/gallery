let path = require('path')
let express = require('express')
let session = require('express-session')
let flash = require('connect-flash')
let bodyParser = require('body-parser')

module.exports = function (process, passport) {
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
    resave: false, // don't save session on new request if vals haven't changed
    saveUninitialized: false // don't save sessions if initialized but unpopulated
  }))
  app.use(flash())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(passport.session())

  require('../server/routes/main.routes.js')(app, passport)

  return app
}

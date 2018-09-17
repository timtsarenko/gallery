let api = require('./api/api.routes.js')
let index = require('./index.routes.js')
let login = require('./login.routes.js')
let signup = require('./signup.routes.js')
let logout = require('./logout.routes.js')
let users = require('./users.routes.js')
let galleries = require('./galleries.routes.js')

module.exports = function (app, passport) {
  app.use('/api', api())

  app.use('/', index())

  app.use('/login', login(passport))
  app.use('/signup', signup(passport))
  app.use('/logout', logout())

  app.use('/users', users())
  app.use('/users/:userid/galleries', galleries())
}

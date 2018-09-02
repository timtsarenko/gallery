let index = require('./index.routes.js')
let login = require('./login.routes.js')
let signup = require('./signup.routes.js')
let logout = require('./logout.routes.js')
let users = require('./users.routes.js')
let galleries = require('./galleries.routes.js')

module.exports = function (app) {
  app.use('/', index)

  app.use('/login', login)
  app.use('/signup', signup)
  app.use('/logout', logout)

  app.use('/users', users)
  app.use('/users/:userid/galleries', galleries)
}

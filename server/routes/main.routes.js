let index = require('./index.routes.js')
let authenticate = require('./authenticate.routes.js')
let users = require('./users.routes.js')
let settings = require('./settings.routes.js')
let galleries = require('./galleries.routes.js')

module.exports = function (app) {
  app.use('/', index)

  app.use('/authenticate', authenticate)

  app.use('/users', users)
  app.use('/users/:userid/settings', settings)
  app.use('/users/:userid/galleries', galleries)
}

const index = require('./index.routes.js')
const authenticate = require('./authenticate.routes.js')
const users = require('./users.routes.js')
const settings = require('./settings.routes.js')
const galleries = require('./galleries.routes.js')

module.exports = function (app) {
  app.use('/', index)

  app.use('/authenticate', authenticate)

  app.use('/users', users)
  app.use('/users/:userid/settings', settings)
  app.use('/users/:userid/galleries', galleries)
}

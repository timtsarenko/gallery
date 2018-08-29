const mongoose = require('mongoose')

module.exports = function () {
  const user = process.env.DB_USER
  const pwd = process.env.DB_PWD

  // TODO: set autoIndex option for production if necessary
  mongoose.connect(
    `mongodb://${user}:${pwd}@ds233212.mlab.com:33212/galeria`,
    { useNewUrlParser: true }
  )

  mongoose.Promise = global.Promise

  mongoose.connection.on('connected', () => {
    console.log('+ mongoose default connection open')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('+ mongoose default connection disconnected')
  })

  mongoose.connection.on('error', (err) => {
    console.log(`+ connection error: ${err}`)
  })

  // if Node process ends, close connection
  process.on('SIGINT', function () {
    mongoose.connection.close(() => {
      console.log('+ mongoose connection disconnected through app termination')
      process.exit(0)
    })
  })

  return mongoose.connection
}

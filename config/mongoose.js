let mongoose = require('mongoose')

module.exports = function (callback) {
  const user = process.env.DB_USER
  const pwd = process.env.DB_PWD

  // TODO: set autoIndex option for production if necessary

  if (process.env.NODE_ENV === 'test') {
    mongoose.connect(
      `mongodb://${user}:${pwd}@ds251022.mlab.com:51022/galeria-test`,
      { useNewUrlParser: true }
    )
  } else {
    mongoose.connect(
      `mongodb://${user}:${pwd}@ds233212.mlab.com:33212/galeria`,
      { useNewUrlParser: true }
    )
  }

  mongoose.Promise = global.Promise

  mongoose.connection.on('connected', () => {
    console.log('+ mongoose default connection open')

    // if we need to wait for connection to be established first, pass a callback
    if (callback) { callback() }
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

  require('../server/models/User.js')
  require('../server/models/Gallery.js')
  require('../server/models/Artwork.js')

  return mongoose.connection
}

const mongoose = require('mongoose')

module.exports = function () {
  const user = process.env.DB_USER
  const pwd = process.env.DB_PWD

  mongoose.connect(`mongodb://${user}:${pwd}@ds233212.mlab.com:33212/galeria`)
  mongoose.Promise = global.Promise

  let db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '))

  return db
}

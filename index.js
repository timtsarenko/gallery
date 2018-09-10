require('dotenv').config()

let app = require('./config/app.js')()

module.exports = app.listen(3000, function () {
  console.log(`+ ${process.env.NODE_ENV} server now listening on port 3000`)
})

require('dotenv').config()

require('./config/mongoose.js')() // creates connection to DB

let passport = require('./config/passport.js')()
let app = require('./config/express.js')(process, passport)

module.exports = app.listen(3000, function () {
  console.log(`+ ${process.env.NODE_ENV} server now listening on port 3000`)
})

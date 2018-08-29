require('dotenv').config()

const config = require('./config/config.js')

require('./config/mongoose.js')() // creates connection to DB
let app = require('./config/express.js')()

app.listen(config.port, function () {
  console.log(`+ ${process.env.NODE_ENV} server now listening on port ${config.port}`)
})

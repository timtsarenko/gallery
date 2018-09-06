require('dotenv').config()

require('./config/mongoose.js')() // creates connection to DB
require('./config/passport.js')() // sets strategies for passport

let app = require('./config/express.js')(process)

app.listen(3000, function () {
  console.log(`+ ${process.env.NODE_ENV} server now listening on port 3000`)
})

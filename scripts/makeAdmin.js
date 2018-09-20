// This script takes an existing user from
// our database and gives them admin status.
// Expects the username of existing user
// to be passed as an argument to the script.

require('dotenv').config({ path: `${__dirname}/../.env` })
let mongoose = require('../config/mongoose.js')
let username = process.argv[2]

mongoose(function () {
  let User = require('mongoose').model('User')

  User.findOneAndUpdate({ username: username }, { admin: true }, (err, user) => {
    if (err) { console.log(err) }
    if (user) { console.log(`+ ${username} now has admin status`) }
    process.exit()
  })
})

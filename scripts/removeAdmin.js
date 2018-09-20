// This script takes an existing user from
// our database and removes the admin status.
// Expects the username of existing user
// to be passed as an argument to the script.

require('dotenv').config({ path: `${__dirname}/../.env` })
let mongoose = require('../config/mongoose.js')
let username = process.argv[2]

mongoose(function () {
  let User = require('mongoose').model('User')

  User.findOneAndUpdate({ username: username }, { admin: false }, (err, user) => {
    if (err) { console.log(err) }
    if (user) { console.log(`+ ${username} no longer has admin status`) }
    process.exit()
  })
})

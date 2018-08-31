let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UserSchema = new Schema(
  {
    username: {type: String, required: true, max: 128},
    email: {type: String, required: true},
    password: {type: String, required: true},
    age: {type: Number, required: true, min: 13}
  }
)

module.exports = mongoose.model('User', UserSchema)

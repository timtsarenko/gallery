let mongoose = require('mongoose')
let Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator')
let bcrypt = require('bcryptjs')

let UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
    email: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
    passwordHash: {type: String, required: true}
  }
)

UserSchema.plugin(uniqueValidator)

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

// use the virtual 'password' when creating to ensure encryption occurs!
UserSchema.virtual('password').set(function (password) {
  this.passwordHash = bcrypt.hashSync(password, 10)
})

module.exports = mongoose.model('User', UserSchema)

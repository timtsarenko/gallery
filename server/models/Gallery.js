let mongoose = require('mongoose')
let Schema = mongoose.Schema

let GallerySchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created: { type: Date, default: Date.now },
    title: { type: String, required: true, max: 128 }
  }
)

module.exports = mongoose.model('Gallery', GallerySchema)

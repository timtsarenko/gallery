let mongoose = require('mongoose')
let Schema = mongoose.Schema

let GallerySchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, max: 128 },
    created: { type: Date, default: Date.now },
    description: { type: String, max: 1024 },
    artworks: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }]
  }
)

module.exports = mongoose.model('Gallery', GallerySchema)

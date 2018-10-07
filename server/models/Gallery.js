let mongoose = require('mongoose')
let Schema = mongoose.Schema

let GallerySchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, max: 128, default: 'Gallery' },
    created: { type: Date, default: Date.now },
    description: { type: String, max: 1024, default: '' },
    artworks: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
    private: { type: Boolean, required: true, default: false },
    slug: { type: String, required: true, max: 200, default: 'gallery' }
  }
)

module.exports = mongoose.model('Gallery', GallerySchema)

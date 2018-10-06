let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ArtworkSchema = new Schema(
  {
    title: { type: String, required: true, max: 128 },
    author: { type: String, required: false, max: 128 },
    description: { type: String, required: false, max: 1024 },
    file_path: { type: String, required: true, max: 512 }
  }
)

module.exports = mongoose.model('Artwork', ArtworkSchema)

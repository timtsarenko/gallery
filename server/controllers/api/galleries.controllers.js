let Gallery = require('mongoose').model('Gallery')
let User = require('mongoose').model('User')

// [GALLERIES]
exports.readGalleries = function (req, res, next) {
  Gallery.find({}, 'creator title description private', { lean: true }, function (err, galleries) {
    err ? next(err) : res.json(galleries)
  })
}

// [GALLERY]
exports.createGallery = function (req, res, next) {
  let form = req.body

  if ( form.title == null || form.private == null ) {
    res.send(400) // due to bad request
  } 
  else {
    User.findOne({ username: req.params.userId })
    .populate('galleries', 'slug')
    .exec((err, user) => {
      if (err) {
        // @todo better error handling
        res.send(400) // bad request
      }
      let userDoc = user

      // check that there is not an existing gallery with :galleryId for that user
      if ( userDoc.galleries.some( (gallery) => gallery.slug === req.params.galleryId ) ) {
        // @todo better error handling
        res.send(409) // conflict
      }

      // if the values are undefined, they are not saved into object
      let newGallery = new Gallery({
        creator: userDoc._id,
        title: form.title,
        description: form.description, 
        artworks: form.artworks,
        private: form.private,
        slug: req.params.galleryId
      })
        
      newGallery.save(function (err) {
        if (err) {
            !(err.name == null) && err.name === 'ValidationError'
            ? res.send(400) : next(err)
        } else {
          // update the user document gallery list
          userDoc.galleries.push(newGallery)

          // @todo update with markModified and save so it doesn't need to do another search
          User.findByIdAndUpdate(userDoc._id, { galleries: userDoc.galleries }, (err, user) => {
            if (err) {
              // @todo better error handling
              res.send(404) // Not Found
            }
            
            res.json(newGallery)
          })
        }
      })
    })
  }
}

exports.readGallery = function (req, res, next) {
// @todo implement a check for private.
// @todo avoid duplication by moving to middleware function instead
    User.findOne({ username: req.params.userId }, (err, user) => {
        if (err) {
          res.send(400)
        }
        let userDoc = user

        Gallery.findOne(
            { slug: req.params.galleryId },
            { lean: true },
            (err, gallery) => { err ? next(err) : res.json(gallery) }
        )
    })
}

// exports.updateGallery = function (req, res, next) {
//   let query = Gallery.findOneAndUpdate(
//     { Galleryname: req.params.GalleryId },
//     { $set: req.body },
//     { new: true, runValidators: true, context: 'query' }
//   )

//   // execute if admin parameter not included, or it is and action done by an admin
//   if (req.body.admin == null || (req.body.admin && req.Gallery.admin)) {
//     query.exec((err, Gallery) => {
//       if (err) {
//         !(err.name == null) && err.name === 'ValidationError'
//           ? res.send(400) : next(err)
//       } else {
//         res.json(Gallery)
//       }
//     })
//   } else {
//     res.send(401)
//   }
// }

exports.deleteGallery = function (req, res, next) {
    // @todo avoid duplication by moving to middleware function instead
    User.findOne({ username: req.params.userId }, (err, user) => {
        if (err) {
          res.send(400)
        }
        let userDoc = user

        Gallery.deleteOne({ creator: user._id, slug: req.params.galleryId }, function (err) {
            err ? next(err) : res.send(200)
        })
    })
}

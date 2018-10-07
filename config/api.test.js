require('dotenv').config()

let request = require('supertest')

let app = require('./app.js')()
let User = require('mongoose').model('User')

// Note the difference between authenticated and authorized:
// authenticated: user has been verified
// authorized: user has permission to access the requested data

describe('/users', () => {
  describe('API actions without authentication', () => {
    it('creates a new user if form is correct', () => {
      let form = {
        username: 'dynamik',
        email: 'dynamik@laika.gallery',
        password: 'elpasswordodedynamik'
      }
  
      return request(app)
        .post('/api/users/dynamik')
        .send(form)
        .then(res => {
          expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
          let data = JSON.parse(res.text)
          expect(data.username).toBe('dynamik')
          expect(data.email).toBe('dynamik@laika.gallery')
        })
    })
  
    it('fails to create a new user if form is missing content', () => {
      let form = {
        username: 'wrongo',
        password: 'elpasswordodewrongo'
      }
  
      return request(app)
        .post('/api/users/wrongo')
        .send(form)
        .then(res => {
          expect(res.statusCode).toBe(400)
        })
    })
  
    it('fails to create a user if lacks unique content', () => {
      let form = {
        username: 'dynamik',
        email: 'dynamik@laika.gallery',
        password: 'elpasswordodedynamik'
      }
  
      return request(app)
        .post('/api/users/dynamik')
        .send(form)
        .then(res => {
          expect(res.statusCode).toBe(400)
        })
    })
  
    it('fails to fetch /api/ data', () => {
      return request(app)
        .get('/api/users/apitea')
        .then(res => {
          expect(res.statusCode).toBe(401)
        })
    })
  })
  
  describe('CRUD operations on /api/ data with authentication', () => {
    // for the following tests, agents are authenticated
  
    let agent = request.agent(app)
  
    beforeAll(done => {
      let newUser = new User({
        username: 'apitea',
        email: 'hello@laika.gallery',
        password: 'elpasswordodeapitea'
      })
  
      newUser.save(function (err) {
        if (err) {
          done(err)
        } else { // once user exists, start a session
          agent
            .post('/login')
            .send({ username: 'apitea', password: 'elpasswordodeapitea' })
            .end((err, res) => err ? done(err) : done())
        }
      })
    })
  
    it('fails to fetch /api/ data for unauthorized user', () => {
      return agent
        .get('/api/users/othertea')
        .then(res => {
          expect(res.statusCode).toBe(401)
        })
    })
  
    describe('CRUD operations on /api/ data with authorization', () => {
      // [USER]
      it('gets user data', () => {
        return agent
          .get('/api/users/apitea')
          .then(res => {
            expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
            let data = JSON.parse(res.text)
            expect(data.username).toBe('apitea')
            expect(data.email).toBe('hello@laika.gallery')
          })
      })
  
      it('updates user data', () => {
        let form = { email: 'hola@laika.gallery' }
        return agent
          .put('/api/users/apitea')
          .send(form)
          .then(res => {
            expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
            let data = JSON.parse(res.text)
            expect(data.username).toBe('apitea')
            expect(data.email).toBe('hola@laika.gallery')
          })
      })
  
      it('fails to update data if not unique', () => {
        let form = { email: 'dynamik@laika.gallery' }
        return agent
          .put('/api/users/apitea')
          .send(form)
          .then(res => {
            expect(res.statusCode).toBe(400)
          })
      })
  
      it('fails to update data if it requires admin privilege', () => {
        let form = { admin: true }
        return agent
          .put('/api/users/apitea')
          .send(form)
          .then(res => {
            expect(res.statusCode).toBe(401)
          })
      })
  
      it('deletes user if request is for self', () => {
        return agent
          .delete('/api/users/apitea')
          .then(res => {
            expect(res.statusCode).toBe(200)
          })
      })
    })
  
    describe('Admin privileges', () => {
      let admin = request.agent(app)
  
      beforeAll(done => {
        let newUser = new User({
          username: 'admin',
          email: 'admin@laika.gallery',
          password: 'admin',
          admin: true
        })
  
        newUser.save(function (err) {
          if (err) {
            done(err)
          } else { // once user exists, start a session
            admin
              .post('/login')
              .send({ username: 'admin', password: 'admin' })
              .end((err, res) => err ? done(err) : done())
          }
        })
      })
  
      afterAll(done => {
        User.deleteOne({ username: 'admin' }, err => err ? done(err) : done())
      })
  
      it('gets the data for all users', () => {
        return admin
          .get('/api/users')
          .then(res => {
            expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
            let data = JSON.parse(res.text)
            expect(data.length).not.toBeLessThan(2)
          })
      })
  
      it('gets unrelated user\'s data', () => {
        return admin
          .get('/api/users/dynamik')
          .then(res => {
            expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
            let data = JSON.parse(res.text)
            expect(data.username).toBe('dynamik')
            expect(data.email).toBe('dynamik@laika.gallery')
          })
      })
  
      it('updates user\'s data, even if it requires admin privilege', () => {
        let form = { admin: true, email: 'welcome@laika.gallery' }
        return admin
          .put('/api/users/dynamik')
          .send(form)
          .then(res => {
            expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
            let data = JSON.parse(res.text)
            expect(data.admin).toBe(true)
            expect(data.email).toBe('welcome@laika.gallery')
          })
      })
  
      it('can delete any user', () => {
        return admin
          .delete('/api/users/dynamik')
          .then(res => {
            expect(res.statusCode).toBe(200)
          })
      })
    })
  })
})

describe('/galleries', () => {
  // describe('API actions without authentication', () => {

  //   beforeAll(done => {
  //     let newUser = new User({
  //       username: 'laikagaloriee',
  //       email: 'laikagaloriee@laika.gallery',
  //       password: 'passworddrowssap'
  //     })

  //     request(app)
  //       .post('/api/users/laikagaloriee')
  //       .send(newUser)
  //       .then(res => {
  //         expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  //         done()
  //       })

  //     // newUser.save(function (err) {
  //     //   if (err) {
  //     //     done(err)
  //     //   } else { // once user exists, start a session
  //     //     admin
  //     //       .post('/login')
  //     //       .send({ username: 'laikagaloriee', password: 'passworddrowssap' })
  //     //       .end((err, res) => err ? done(err) : done())
  //     //   }
  //     // })
  //   })

  //   afterAll(done => {
  //     User.deleteOne({ username: 'laikagaloriee' }, err => err ? done(err) : done())
  //   })


  //   it('creates a new gallery if form is correct', () => {
  //     let form = {
  //       title: 'Sketchy Owls',
  //       description: 'the real draw is the sketchiness of these owls',
  //       artworks: [ 'artwork1-id', 'artwork2-id' ],
  //       private: true,
  //     }

  //     return request(app)
  //       .post('/api/users/laikagaloriee/galleries/sketchy-owls')   
  //       .send(form)
  //       .then(res => {
  //         expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //         let data = JSON.parse(res.text)
  //         expect(data.title).toBe('Sketchy Owls')
  //         expect(data.description).toBe('the real draw is the sketchiness of these owls')
  //         expect(data.artworks).toBe([ 'artwork1-id', 'artwork2-id' ])
  //         expect(data.private).toBeTruthy()
  //       })
  //     })
  
  //   // it('fails to create a new gallery if form is missing content', () => {
  //   //   let form = {
  //   //     description: 'this is missing a title',
  //   //     artworks: [ 'artwork-1-id', 'artwork-2-id' ],
  //   //     private: false,
  //   //   }
  
  //   //   return request(app)
  //   //     .post('/api/users/laikagaloriee/galleries/wrongo')
  //   //     .send(form)
  //   //     .then(res => {
  //   //       expect(res.statusCode).toBe(400)
  //   //     })
  //   // })
  // })
  
  //   it('fails to create a gallery if lacks unique content', () => {
  //     let form = {
  //       username: 'dynamik',
  //       email: 'dynamik@laika.gallery',
  //       password: 'elpasswordodedynamik'
  //     }
  
  //     return request(app)
  //       .post('/api/users/dynamik/galleries/dynamik')
  //       .send(form)
  //       .then(res => {
  //         expect(res.statusCode).toBe(400)
  //       })
  //   })
  
  //   it('fails to fetch /api/ data', () => {
  //     return request(app)
  //       .get('/api/users/dynamik/galleries/apitea')
  //       .then(res => {
  //         expect(res.statusCode).toBe(401)
  //       })
  //   })
  // })
  
  // describe('CRUD operations on /api/ data with authentication', () => {
  //   // for the following tests, agents are authenticated
  
  //   let agent = request.agent(app)
  
  //   beforeAll(done => {
  //     let newUser = new Gallery({
  //       username: 'apitea',
  //       email: 'hello@laika.gallery',
  //       password: 'elpasswordodeapitea'
  //     })
  
  //     newUser.save(function (err) {
  //       if (err) {
  //         done(err)
  //       } else { // once user exists, start a session
  //         agent
  //           .post('/login')
  //           .send({ username: 'apitea', password: 'elpasswordodeapitea' })
  //           .end((err, res) => err ? done(err) : done())
  //       }
  //     })
  //   })
  
  //   it('fails to fetch /api/ data for unauthorized user', () => {
  //     return agent
  //       .get('/api/users/dynamik/galleries/othertea')
  //       .then(res => {
  //         expect(res.statusCode).toBe(401)
  //       })
  //   })
  
  //   describe('CRUD operations on /api/ data with authorization', () => {
  //     // [USER]
  //     it('gets user data', () => {
  //       return agent
  //         .get('/api/users/dynamik/galleries/apitea')
  //         .then(res => {
  //           expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //           let data = JSON.parse(res.text)
  //           expect(data.username).toBe('apitea')
  //           expect(data.email).toBe('hello@laika.gallery')
  //         })
  //     })
  
  //     it('updates user data', () => {
  //       let form = { email: 'hola@laika.gallery' }
  //       return agent
  //         .put('/api/users/dynamik/galleries/apitea')
  //         .send(form)
  //         .then(res => {
  //           expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //           let data = JSON.parse(res.text)
  //           expect(data.username).toBe('apitea')
  //           expect(data.email).toBe('hola@laika.gallery')
  //         })
  //     })
  
  //     it('fails to update data if not unique', () => {
  //       let form = { email: 'dynamik@laika.gallery' }
  //       return agent
  //         .put('/api/users/dynamik/galleries/apitea')
  //         .send(form)
  //         .then(res => {
  //           expect(res.statusCode).toBe(400)
  //         })
  //     })
  
  //     it('fails to update data if it requires admin privilege', () => {
  //       let form = { admin: true }
  //       return agent
  //         .put('/api/users/dynamik/galleries/apitea')
  //         .send(form)
  //         .then(res => {
  //           expect(res.statusCode).toBe(401)
  //         })
  //     })
  
  //     it('deletes user if request is for self', () => {
  //       return agent
  //         .delete('/api/users/dynamik/galleries/apitea')
  //         .then(res => {
  //           expect(res.statusCode).toBe(200)
  //         })
  //     })
  //   })
  
  //   describe('Admin privileges', () => {
  //     let admin = request.agent(app)
  
  //     beforeAll(done => {
  //       let newUser = new User({
  //         username: 'admin',
  //         email: 'admin@laika.gallery',
  //         password: 'admin',
  //         admin: true
  //       })
  
  //       newUser.save(function (err) {
  //         if (err) {
  //           done(err)
  //         } else { // once user exists, start a session
  //           admin
  //             .post('/login')
  //             .send({ username: 'admin', password: 'admin' })
  //             .end((err, res) => err ? done(err) : done())
  //         }
  //       })
  //     })
  
  //     afterAll(done => {
  //       User.deleteOne({ username: 'admin' }, err => err ? done(err) : done())
  //     })
  
  //     it('gets the data for all users', () => {
  //       return admin
  //         .get('/api/users/dynamik/galleries')
  //         .then(res => {
  //           expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //           let data = JSON.parse(res.text)
  //           expect(data.length).not.toBeLessThan(2)
  //         })
  //     })
  
  //     it('gets unrelated user\'s data', () => {
  //       return admin
  //         .get('/api/users/dynamik/galleries/dynamik')
  //         .then(res => {
  //           expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //           let data = JSON.parse(res.text)
  //           expect(data.username).toBe('dynamik')
  //           expect(data.email).toBe('dynamik@laika.gallery')
  //         })
  //     })
  
  //     it('updates user\'s data, even if it requires admin privilege', () => {
  //       let form = { admin: true, email: 'welcome@laika.gallery' }
  //       return admin
  //         .put('/api/users/dynamik/galleries/dynamik')
  //         .send(form)
  //         .then(res => {
  //           expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
  
  //           let data = JSON.parse(res.text)
  //           expect(data.admin).toBe(true)
  //           expect(data.email).toBe('welcome@laika.gallery')
  //         })
  //     })
  
  //     it('can delete any user', () => {
  //       return admin
  //         .delete('/api/users/dynamik/galleries/dynamik')
  //         .then(res => {
  //           expect(res.statusCode).toBe(200)
  //         })
  //     })
  //   })
  // })
})
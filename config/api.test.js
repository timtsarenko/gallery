require('dotenv').config()

let request = require('supertest')

let app = require('./app.js')()
let User = require('mongoose').model('User')

// Note the difference between authenticated and authorized:
// authenticated: user has been verified
// authorized: user has permission to access the requested data

it('fails to fetch /api/ data for unauthenticated', () => {
  return request(app)
    .get('/api/users/apitea')
    .then(res => {
      expect(res.statusCode).toBe(401)
    })
})

describe('CRUD operations on /api/ data with authentication', () => {
  // for the following tests, agents are authenticated

  let agent = request.agent(app)

  beforeAll(done => {
    let newUser = new User({
      username: 'apitea',
      email: 'hello@apitea.com',
      password: 'elpasswordodeapitea'
    })

    newUser.save(function (err) {
      if (err) {
        done(err)
      } else { // once user exists, start a session
        agent
          .post('/login')
          .send({username: 'apitea', password: 'elpasswordodeapitea'})
          .end((err, res) => {
            if (err) { done(err) }
            done()
          })
      }
    })
  })

  afterAll((done) => {
    User.deleteOne({username: 'apitea'}, (err) => {
      if (err) {
        done(err)
      } else {
        done()
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

  describe('Admin priviledges', () => {
    let admin = request.agent(app)

    beforeAll(done => {
      admin
        .post('/login')
        .send({username: 'admin', password: 'admin'})
        .end((err, res) => {
          if (err) { done(err) }
          done()
        })
    })

    it('gets unrelated user\'s data', () => {
      return admin 
        .get('/api/users/apitea')
        .then(res => {
          let data = JSON.parse(res.text)

          expect(res.statusCode).toBe(200)
          expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
          expect(data.username).toBe('apitea')
          expect(data.email).toBe('hello@apitea.com')
        })
    })
  })

  describe('CRUD operations on /api/ data with authorization', () => {
    // [USER]
    it('gets user data', () => {
      return agent
        .get('/api/users/apitea')
        .then(res => {
          let data = JSON.parse(res.text)

          expect(res.statusCode).toBe(200)
          expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
          expect(data.username).toBe('apitea')
          expect(data.email).toBe('hello@apitea.com')
        })
    })

    it.skip('updates user data', () => {
      let form = { email: 'hola@apitea.com' }
      return agent
        .put('/api/users/apitea')
        .send(form)
        .then(res => {
        })
    })
  })
})

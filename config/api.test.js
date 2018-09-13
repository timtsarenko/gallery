require('dotenv').config()

let request = require('supertest')

let app = require('./app.js')()
let User = require('mongoose').model('User')

// Note the difference between authenticated and authorized:
// authenticated: user has been verified
// authorized: user has permission to access the requested data

it('fails to fetch /api/ data for unauthenticated', () => {
  return request(app)
    .get('/api/users')
    .then(res => {
      expect(res.statusCode).toBe(401)
    })
})

describe('fetching /api/ data with authentication', () => {
  // for the following tests, agents are authenticated

  let agent = request.agent(app)

  beforeAll((done) => {
    let newUser = new User({
      username: 'apitea',
      email: 'hello@apitea.com',
      password: 'elpasswordodeapitea',
      age: 23
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
    User.deleteMany({username: 'apitea'}, (err) => {
      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  it('returns user data for authorized user', () => {
    return agent
      .get('/api/users/apitea')
      .then(res => {
        let data = JSON.parse(res.text)

        expect(res.statusCode).toBe(200)
        expect(res.get('Content-Type')).toBe('application/json; charset=utf-8')
        expect(data.username).toBe('apitea')
        expect(data.email).toBe('hello@apitea.com')
        expect(data.age).toBe(23)
      })
  })

  it('fails to return user data for unauthorized user', () => {
    return agent
      .get('/api/users/othertea')
      .then(res => {
        expect(res.statusCode).toBe(401)
      })
  })
})

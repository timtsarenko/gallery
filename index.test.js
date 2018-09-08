let request = require('supertest')
let app = require('./index.js')
let User = require('mongoose').model('User')

describe('Test paths without a session', () => {
  it('responds on GET to \'/\'', () => {
    return request(app)
      .get('/')
      .then(res => {
        expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
        expect(res.statusCode).toBe(200)
      })
  })

  it('responds on GET to \'/login\'', () => {
    return request(app)
      .get('/login')
      .then(res => {
        expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
        expect(res.statusCode).toBe(200)
      })
  })

  it('responds on GET to \'/signup\'', () => {
    return request(app)
      .get('/signup')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
      })
  })

  it('redirects to \'/\' on GET to \'/users/:userid\'', () => {
    return request(app)
      .get('/users/owlsketch')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/')
      })
  })

  // TODO: return only when user exists AND gallery exists
  it('responds on GET to \'/users/:userid/galleries/:gallerid\'', () => {
    return request(app)
      .get('/users/owlsketch/galleries/gal1')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
      })
  })
})

describe('Test login form', () => {
  beforeAll((done) => {
    let newUser = new User({
      username: 'owlsketch',
      email: 'hello@owlsketch.com',
      password: 'elpasswordodeowlsketch',
      age: 23
    })

    newUser.save(function (err) {
      if (err) {
        return done(err)
      }
      return done()
    })
  })

  afterAll((done) => {
    User.remove().exec()
    return done()
  })

  it('redirects to /login on failed login attempt', () => {
    return request(app)
      .post('/login')
      .send({username: 'owlsketch', password: 'nachocheese'})
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/login')
      })
  })

  it('redirects to user\'s page on successful login', () => {
    return request(app)
      .post('/login')
      .send({username: 'owlsketch', password: 'elpasswordodeowlsketch'})
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/users/owlsketch')
      })
  })
})

describe('Test paths with a session', () => {
  // /signup and /login should be inaccessible if
  // the user has logged in
})

describe('Test the logout path', () => {
  it('redirects on GET method', () => {
    return request(app)
      .get('/logout')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/')
      })
  })
})

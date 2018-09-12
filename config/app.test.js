require('dotenv').config()

let request = require('supertest')

let app = require('./app.js')()
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

  it('redirects to \'/\' on GET to \'/logout\'', () => {
    return request(app)
      .get('/logout')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/')
      })
  })
})

describe('Test login and signup forms', () => {
  let submission = {
    username: 'owlsketch',
    email: 'hello@owlsketch.com',
    password: 'elpasswordodeowlsketch',
    age: 23
  }

  beforeAll((done) => {
    let newUser = new User(submission)

    newUser.save(function (err) {
      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  afterAll(() => {
    return User.remove().exec()
  })

  describe('Test login form', () => {
    describe('redirects to /login on failed login attempt', () => {
      it('fails due to non-existing user', () => {
        return request(app)
          .post('/login')
          .send({username: 'nonExistingUser', password: 'nachocheese'})
          .then(res => {
            expect(res.statusCode).toBe(302)
            expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
            expect(res.get('Location')).toBe('/login')
          })
      })
      it('fails due to wrong password on existing user', () => {
        return request(app)
          .post('/login')
          .send({username: 'owlsketch', password: 'nachocheese'})
          .then(res => {
            expect(res.statusCode).toBe(302)
            expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
            expect(res.get('Location')).toBe('/login')
          })
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

  describe('Test signup form', () => {
    describe('redirects to /signup on failed signup attempt', () => {
      it('fails due to existing username', () => {
        submission.email = 'uniqueEmail@owlsketch.com'
        return request(app)
          .post('/signup')
          .send(submission)
          .then(res => {
            expect(res.statusCode).toBe(302)
            expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
            expect(res.get('Location')).toBe('/signup')

            submission.email = 'hello@owlsketch.com'
          })
      })

      it('fails due to existing email', () => {
        submission.username = 'uniqueUser'
        return request(app)
          .post('/signup')
          .send(submission)
          .then(res => {
            expect(res.statusCode).toBe(302)
            expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
            expect(res.get('Location')).toBe('/signup')

            submission.username = 'owlsketch'
          })
      })
    })

    it('redirects to user\'s page on successful signup', () => {
      return request(app)
        .post('/signup')
        .send({ username: 'jouncelimb',
          email: 'hello@jlimb.com',
          password: 'elpasswordodeJLimb',
          age: 23 })
        .then(res => {
          expect(res.statusCode).toBe(302)
          expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
          expect(res.get('Location')).toBe('/users/jouncelimb')
        })
    })
  })
})

describe('Test paths with a session', () => {
  let agent = request.agent(app)

  beforeAll((done) => {
    let newUser = new User({
      username: 'tea',
      email: 'hello@tea.com',
      password: 'elpasswordodetea',
      age: 23
    })

    newUser.save(function (err) {
      if (err) {
        done(err)
      } else { // once user exists, start a session
        agent
          .post('/login')
          .send({username: 'tea', password: 'elpasswordodetea'})
          .end((err, res) => {
            if (err) { done(err) }
            done()
          })
      }
    })
  })

  afterAll(() => {
    return User.remove().exec()
  })

  it('redirects to \'/user/:userid\' on GET to \'/\'', () => {
    return agent
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/users/tea')
      })
  })

  it('redirects to \'/user/:userid\' on GET to \'/login\'', () => {
    return agent
      .get('/login')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/users/tea')
      })
  })

  it('redirects to \'/user/:userid\' on GET to \'/signup\'', () => {
    return agent
      .get('/signup')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/users/tea')
      })
  })

  it('responds on GET to \'/users/:userid\'', () => {
    return agent
      .get('/users/tea')
      .then(res => {
        expect(res.statusCode).toBe(200)
        expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
      })
  })

  it('redirects to \'/\' on GET to \'/logout\'', () => {
    return agent
      .get('/logout')
      .then(res => {
        expect(res.statusCode).toBe(302)
        expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
        expect(res.get('Location')).toBe('/')
      })
  })
})

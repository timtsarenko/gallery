require('dotenv').config()

let app = require('./app.js')()
let User = require('mongoose').model('User')

let request = require('supertest')

function getAndConfirm (request, path) {
  return request
    .get(path)
    .then(res => {
      expect(res.statusCode).toBe(200)
      expect(res.get('Content-Type')).toBe('text/html; charset=UTF-8')
    })
}

function getAndRedirects (request, path, destination) {
  return request
    .get(path)
    .then(res => {
      expect(res.statusCode).toBe(302)
      expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
      expect(res.get('Location')).toBe(destination)
    })
}

function postAndRedirects (request, path, form, destination, callback) {
  return request
    .post(path)
    .send(form)
    .then(res => {
      expect(res.statusCode).toBe(302)
      expect(res.get('Content-Type')).toBe('text/plain; charset=utf-8')
      expect(res.get('Location')).toBe(destination)
      callback()
    })
}

describe('Test paths without a session', () => {
  it('responds on GET to \'/\'', () => {
    return getAndConfirm(request(app), '/')
  })

  it('responds on GET to \'/login\'', () => {
    return getAndConfirm(request(app), '/login')
  })

  it('responds on GET to \'/signup\'', () => {
    return getAndConfirm(request(app), '/signup')
  })

  it('redirects to \'/\' on GET to \'/users/:userid\'', () => {
    return getAndRedirects(request(app), '/users/owlsketch', '/')
  })

  it('redirects to \'/\' on GET to \'/users/:userid/settings\'', () => {
    return getAndRedirects(request(app), '/users/owlsketch/settings', '/')
  })

  // TODO: return only when user exists AND gallery exists
  it('responds on GET to \'/users/:userid/galleries/:gallerid\'', () => {
    return getAndConfirm(request(app), '/users/owlsketch/galleries/gal1')
  })

  it('redirects to \'/\' on GET to \'/logout\'', () => {
    return getAndRedirects(request(app), '/logout', '/')
  })
})

describe('Test login and signup forms', () => {
  let submission = {
    username: 'owlsketch',
    email: 'hello@owlsketch.com',
    password: 'elpasswordodeowlsketch'
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

  afterAll((done) => {
    // only remove data created for this set of tests
    User.deleteMany({username: { $in: ['owlsketch', 'jouncelimb'] }}, (err) => {
      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  describe('Test login form', () => {
    describe('redirects to /login on failed login attempt', () => {
      it('fails due to non-existing user', (done) => {
        postAndRedirects(
          request(app),
          '/login',
          { username: 'noExists', password: 'nachocheese' },
          '/login',
          done
        )
      })

      it('fails due to wrong password on existing user', (done) => {
        postAndRedirects(
          request(app),
          '/login',
          { username: 'owlsketch', password: 'nachocheese' },
          '/login',
          done
        )
      })
    })

    it('redirects to user\'s page on successful login', (done) => {
      postAndRedirects(
        request(app),
        '/login',
        { username: 'owlsketch', password: 'elpasswordodeowlsketch' },
        '/users/owlsketch',
        done
      )
    })
  })

  describe('Test signup form', () => {
    describe('redirects to /signup on failed signup attempt', () => {
      it('fails due to existing username', (done) => {
        submission.email = 'uniqueEmail@owlsketch.com'

        postAndRedirects(request(app), '/signup', submission, '/signup', () => {
          submission.email = 'hello@owlsketch.com'
          done()
        })
      })

      it('fails due to existing email', (done) => {
        submission.username = 'uniqueUser'

        postAndRedirects(request(app), '/signup', submission, '/signup', () => {
          submission.username = 'owlsketch'
          done()
        })
      })
    })

    it('redirects to user\'s page on successful signup', (done) => {
      let newSignUp = {
        username: 'jouncelimb',
        email: 'hello@jlimb.com',
        password: 'elpasswordodeJLimb'
      }

      postAndRedirects(request(app), '/signup', newSignUp, '/users/jouncelimb', done)
    })
  })
})

describe('Test paths with a session', () => {
  let agent = request.agent(app)

  beforeAll((done) => {
    let newUser = new User({
      username: 'tea',
      email: 'hello@tea.com',
      password: 'elpasswordodetea'
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

  afterAll((done) => {
    User.deleteMany({username: 'tea'}, (err) => {
      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  it('redirects to \'/user/:userid\' on GET to \'/\'', () => {
    return getAndRedirects(agent, '/', '/users/tea')
  })

  it('redirects to \'/user/:userid\' on GET to \'/login\'', () => {
    return getAndRedirects(agent, '/login', '/users/tea')
  })

  it('redirects to \'/user/:userid\' on GET to \'/signup\'', () => {
    return getAndRedirects(agent, '/signup', '/users/tea')
  })

  it('responds on GET to \'/users/:userid\'', () => {
    return getAndConfirm(agent, '/users/tea')
  })

  it('responds on GET to \'/users/:userid/settings\'', () => {
    return getAndConfirm(agent, '/users/tea/settings')
  })

  it('redirects to \'/\' on GET to \'/logout\'', () => {
    return getAndRedirects(agent, '/logout', '/')
  })
})

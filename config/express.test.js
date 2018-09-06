let request = require('supertest')
let app = require('./express.js')({env: {SESSION_SECRET: 'buyituseitbreakitfixit'}})

describe('Test the root path', () => {
  it('responds to GET method', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
  })
})

describe('Test the login path', () => {
  it('responds to GET method', () => {
    return request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
  })
})

describe('Test the signup path', () => {
  it('responds to GET method', () => {
    return request(app)
      .get('/signup')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
  })
})

describe('Test the logout path', () => {
  it('redirects on GET method', () => {
    return request(app)
      .get('/logout')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(302)
  })
})

describe('Test the users path', () => {
  it.skip('redirects if no session', () => {})
})

describe('Test the gallery path', () => {
  it.skip('returns gallery page if exists', () => {})
})

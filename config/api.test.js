require('dotenv').config()

let request = require('supertest')

let app = require('./app.js')()
// let User = require('mongoose').model('User')

it('fails to fetch /api/ data for unauthorized', () => {
  return request(app)
    .get('/api/users')
    .then(res => {
      expect(res.statusCode).toBe(401)
    })
})

describe('fetching /api/ data with auth', () => {

})

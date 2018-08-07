const path = require('path')

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('Hola mundo!')
    //res.sendFile(path.join(__dirname + '/test.html'))
  })
}

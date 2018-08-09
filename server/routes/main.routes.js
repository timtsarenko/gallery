const path = require('path')

module.exports = function (app) {
  const viewPath = app.get('viewPath') 

  app.get('/', function (req, res) {
    res.sendFile(path.join(viewPath, 'test.html'))
  })
}

let merge = require('webpack-merge')
let common = require('./webpack.common.js')

module.exports = merge(common, {
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
})

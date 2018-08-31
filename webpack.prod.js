let merge = require('webpack-merge')
let common = require('./webpack.common.js')

let webpack = require('webpack')
let UglifyJSPlugin = require('uglifyjs-webpack-plugin')
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    // tells front-end components we're in production mode
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('production') }
    })
  ]
})

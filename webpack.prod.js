const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

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

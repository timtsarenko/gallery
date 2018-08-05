const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

let extractPlugin = new ExtractTextPlugin({
  filename: '[name].bundle.css'
})

module.exports = {
  entry: {
    main: './public/js/main.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env'] }
          }
        ]
      },
      {
        test: /\.css$/,
        use: extractPlugin.extract({ use: ['css-loader'] })
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({ use: ['css-loader', 'sass-loader'] })
      }
    ]
  },
  plugins: [
    extractPlugin,
    new CleanWebpackPlugin(['build'])
  ]
}

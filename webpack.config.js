// webpack.config.js
const webpack = require('webpack')
const path = require('path')

let PROD = process.env.NODE_ENV === "production" ? 1: 0;

console.log({PROD: process.env.MODE})

module.exports = {
  entry: {
    Broadcaster: path.resolve(__dirname, 'client/module/broadcaster.js'),
    Viewer: path.resolve(__dirname, 'client/module/viewer.js')
  },
  output: {
    publicPath: 'dist',
    path: path.resolve(__dirname, 'client/dist'),
    filename: PROD ? 'nile.[name].min.js' : 'nile.[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015']
          ]
        }
      }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : []
}
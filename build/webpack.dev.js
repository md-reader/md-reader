const merge = require('webpack-merge')
const commentConfig = require('./webpack.common.js')
const ExtensionReloader = require('webpack-extension-reloader')

module.exports = merge(commentConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: [/node_modules/, /extension/, /template/],
  },
  plugins: [new ExtensionReloader()],
})
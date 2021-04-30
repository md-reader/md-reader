const merge = require('webpack-merge')
const commentConfig = require('./webpack.common.js')

module.exports = merge(commentConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: [/node_modules/, /extension/, /template/],
  },
})

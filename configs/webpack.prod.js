const merge = require('webpack-merge')
const commentConfig = require('./webpack.config')

module.exports = merge(commentConfig, {
  mode: 'production',
})

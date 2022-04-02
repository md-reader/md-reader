const merge = require('webpack-merge')
const commentConfig = require('./webpack.common.js')

module.exports = merge(commentConfig, {
  mode: 'production',
})

const { merge } = require('webpack-merge')
const commentConfig = require('./webpack.common.js')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = merge(commentConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'chrome80',
        css: true,
      }),
    ],
  },
})

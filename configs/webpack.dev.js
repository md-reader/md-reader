const { join, resolve } = require('path')
const merge = require('webpack-merge')
const commentConfig = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(commentConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: [/node_modules/, /extension/, /template/],
  },
  devServer: {
    contentBase: join(__dirname, '../extension'),
    port: 9000,
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        // { from: resolve(PROJECT_ROOT, 'template'), ignore: ['*.html'] },
        {
          from: resolve(__dirname, '../src/manifest.json'),
        },
        {
          from: resolve(__dirname, '../src/images'),
          to: 'images',
        },
      ],
      {
        copyUnmodified: true,
      }
    ),
  ],
})

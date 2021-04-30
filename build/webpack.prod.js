const fs = require('fs')
const path = require('path')
const merge = require('webpack-merge')
const commentConfig = require('./webpack.common.js')
const version = require('../package.json').version
let webpackProdConfig

try {
  let manifest = fs.readFileSync(
    path.resolve(__dirname, '../src/manifest.json'),
    'utf-8',
  )
  manifest = JSON.parse(manifest)
  console.log(manifest.version, '==>', version)
  manifest.version = version
  fs.writeFileSync(
    path.resolve(__dirname, '../src/manifest.json'),
    JSON.stringify(manifest, ' ', 2),
    'utf-8',
  )
  webpackProdConfig = merge(commentConfig, {
    mode: 'production',
  })
} catch (err) {
  console.error(err)
}

module.exports = webpackProdConfig

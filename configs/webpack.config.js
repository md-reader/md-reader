const { resolve } = require('path')

module.exports = {
  entry: resolve(__dirname, '../src'),
  output: {
    filename: 'inject.js',
    path: resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
}

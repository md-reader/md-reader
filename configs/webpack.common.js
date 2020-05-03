const { resolve } = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: resolve(__dirname, '../src/index.ts'),
  output: {
    filename: 'js/inject.js',
    path: resolve(__dirname, '../extension'),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: [/\.(png|bmp|gif|jpg)$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              // name: '[name].[contenthash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    new miniCssExtractPlugin({
      filename: 'css/index.css',
    }),
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
        ignore: [/-crx\.(jpg|png)$/],
        copyUnmodified: true,
      }
    ),
  ],
}

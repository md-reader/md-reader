const { resolve } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const SveltePreprocess = require('svelte-preprocess')

module.exports = {
  entry: {
    'content-script': resolve(__dirname, '../src/main.ts'),
    background: resolve(__dirname, '../src/background.ts'),
    popup: resolve(__dirname, '../src/popup/index.ts'),
  },
  output: {
    filename: 'js/[name].js',
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
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: SveltePreprocess.typescript(),
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|bmp|gif|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              outputPath: 'images',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: 'svg-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.woff2$/,
        loader: 'file-loader',
        options: {
          outputPath: 'fonts',
          publicPath: 'chrome-extension://__MSG_@@extension_id__/fonts',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.svelte', '.json', '.less'],
  },
  stats: 'errors-only',
  plugins: [
    new FriendlyErrors(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '../src/manifest.json'),
        },
        {
          from: resolve(__dirname, '../src/_locales'),
          to: '_locales',
        },
        {
          from: resolve(__dirname, '../src/images'),
          to: 'images',
        },
        {
          from: resolve(__dirname, '../src/popup/index.html'),
          to: 'popup.html',
        },
      ],
    }),
  ],
}

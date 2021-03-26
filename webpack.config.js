const ejs = require('ejs')
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const zipPlugin = require('zip-webpack-plugin')
const manifest  = require('./src/manifest.json')

const transformHtml = content => ejs.render(content.toString(), {...process.env})

const publishPattern = [
  {from: 'src/popup/popup.html', to: 'popup/popup.html', transform: transformHtml},
  {
    from: './src/manifest.json',
    to: 'manifest.json',
    transform: content => {
      content = JSON.parse(content)

      if (process.env.NODE_ENV === 'development') {
        content['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
      }

      return JSON.stringify(content, null, 2)
    }
  }
]

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    'background': './src/background.ts',
    'handler': './src/handler.ts',
    'content': './src/content.ts',
    'popup/popup': './src/popup/popup.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({ patterns: publishPattern }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new zipPlugin({
      filename: `product_taste-v${manifest.version}.zip`
    })
  ]
}

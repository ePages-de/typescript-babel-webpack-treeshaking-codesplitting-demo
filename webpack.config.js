'use strict'

var fs = require('fs')
var packageJson = require('./package.json')
var path = require('path')
var UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  target: 'web',
  entry: {
    app: [
      './index.html',
      './index.ts'
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },
  output: {
    path: path.resolve('./build'),
    filename: 'assets/app.js',
    chunkFilename: 'assets/app-[id].js',
    publicPath: '/',
  },
  context: path.resolve('./src'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              configFileName: 'tsconfig.json',
              silent: true,
              useBabel: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: '[path][name].[ext]'
            }
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'assets/vendor.js',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    process.env.NODE_ENV === 'production' && new UglifyWebpackPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          semicolons: false,
        },
      },
    })
  ].filter(p => Boolean(p)),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: '#sourcemap',
}

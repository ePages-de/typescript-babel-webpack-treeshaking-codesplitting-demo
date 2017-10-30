'use strict'

var port = parseInt(process.env.PORT || '8000')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')
var WebpackDevServer = require('webpack-dev-server')

webpackConfig.entry.app.unshift('webpack-dev-server/client?http://localhost:' + port + '/', 'webpack/hot/dev-server')
webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin())

var compiler = webpack(webpackConfig)
var server = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  hot: true,
  inline: true,
})

server.listen(port, '127.0.0.1', function(err) {
  if (err) return console.err(err)
  console.log('Now listening on http://localhost:' + port)
})
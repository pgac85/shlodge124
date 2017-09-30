
if (typeof __webpack_require__ === 'undefined') {
  var path = require('path')
  var express = require('express')
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
  var wpisocfg = require('../../webpack.iso.js')
  var wpiso = new WebpackIsomorphicTools(wpisocfg.options)
  var publicPath = wpisocfg.output.publicPath
  var babelRe = /(app\/javascripts)/
  var mw = process.env.ASSETS_DEV === 'true' ? devMw() : prodMw()

  wpiso.server(wpisocfg.context)
  require('babel-register')({
    only: babelRe,
    plugins: [['transform-es2015-modules-commonjs', {loose: false}]]
  })

  module.exports = function (req, res, next) {
    Object.defineProperty(res.locals, '__assets', {
      enumerable: true,
      get: wpiso.assets.bind(wpiso)
    })
    mw(req, res, next)
  }

  /* eslint-disable no-inner-declarations */
  function prodMw () {
    if (!require('fs').existsSync(path.resolve(__dirname, '../../webpack-assets.json'))) throw new Error('assets not built')
    return express.Router().use(publicPath, express.static(wpisocfg.output.path))
  }

  function devMw () {
    wpiso.development()
    var mw
    return function (req, res, next) {
      if (!mw) mw = _devMw(req)
      mw(req, res, next)
    }
  }

  function _devMw (req) {
    var wpcfg = require('../../webpack.config.js')({dev: true, hot: true})
    var webpack = require('webpack')
    var compiler = webpack(wpcfg)
    var compiled = false
    compiler.plugin('compile', () => compiled = compiled || console.log('webpack building...') || true)
    compiler.plugin('done', (stats) => console.log(stats.toString()))
    compiler.plugin('done', function () {
      Object.keys(require.cache).filter((k) => babelRe.test(k)).forEach((k) => delete require.cache[k])
      wpiso.refresh()
    })
    var hotPath = '/__webpack_hmr'
    var wpDevMw = require('webpack-dev-middleware')(compiler, {publicPath, noInfo: true, quiet: true})
    var wpHotMw = require('webpack-hot-middleware')(compiler, {path: hotPath})
    require('../watch.js')([], ['app/views'], /\.pug$/, () => wpHotMw.publish({}))
    return express.Router()
      .get(new RegExp(publicPath + '/?.*\.css$'), (_, res) => {
        res.set('Content-Type', 'text/css')
        res.send('/* removed by hmr */')
      })
      .use(wpDevMw)
      .get(hotPath, wpHotMw)
      .post(hotPath, function (req, res, next) {
        wpHotMw.publish(req.body)
        res.send('ok')
      })
  }
} else {
  require('webpack-hot-middleware/client?reload=true').subscribe(function (data) {
    data = data || {}
    data.action = data.action || 'reload'
    if (data.action === 'reload') {
      console.warn('[HMR] Reloading page')
      return window.location.reload()
    }
    console.warn('[HMR] Unknown action: ' + data.action)
  })
}

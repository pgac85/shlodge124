
module.exports = process.env.ROUTER_DEV === 'true' ? mw() : router()

function router () {
  return require('../../app/router.js')
}

function mw () {
  require('../watch.js')(['app/router.js'], ['app/controllers'], /\.js$/, fs => {
    delete require.cache[require.resolve('../../app/router.js')]
    Object.keys(require.cache)
      .filter(k => fs.some(f => k.startsWith(f)))
      .forEach(k => delete require.cache[k])
  })
  return (req, res, next) => router()(req, res, next)
}

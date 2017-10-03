var path = require('path')
var async = require('async')
var mongodb = require('./lib/mongodb.js')
var express = require('express')
var compression = require('compression')
var cache = require('express-cache-headers')
var app = express()

app.use(cache(60))
app.use(compression())
app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'app/views'))
app.disable('x-powered-by')
app.use(require('serve-favicon')(path.resolve(__dirname, 'app/images/favicon.ico')))
app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('body-parser').json())
app.use(require('method-override')('_method'))

// TODO: Require these images as necessary and remove static mw
app.use('/images', express.static(path.resolve(__dirname, 'app/images')))
app.use('/pdf', express.static(__dirname + 'app/pdf'));

app.use(require('./lib/middleware/assets.js'))
app.use(require('./lib/middleware/router.js'))
app.use(require('morgan')('dev'))

var errors = require('./lib/middleware/errors.js')
app.use((req, res, next) => next(new errors.NotFoundError()))
app.use(errors.handler)

const port = process.env.NODE_ENV === 'production' ? process.env.OPENSHIFT_NODEJS_PORT || 8080 : 3000
const ip   = process.env.NODE_ENV === 'production' ? process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0' : '0.0.0.0'

app.start = function (done) {
  async.parallel([
    mongodb.init,
    done => app.server = app.listen(port, ip, done)
  ], done)
}

app.stop = function (done) {
  if (!app.server) return mongodb.disconnect(done)
  app.server.close(function () {
    app.server = null
    mongodb.disconnect(done)
  })
}

if (process.mainModule === module) {
  console.log('starting')

  process.on('SIGTERM', function () {
    console.log('caught SIGTERM, stopping')
    app.stop(function (err) {
      if (err) console.warn(err, 'error while stopping')
      var status = 143 + (err ? 1 : 0)
      console.log('exiting with status %s', status)
      process.exit(status)
    })
  })

  app.start(function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('started')
    console.log("Express server listening on port " + port)
  })
}

module.exports = app

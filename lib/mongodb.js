/**
 * MongoDB Connection via Mongoose
 */
var mongoose = require('mongoose')

exports.options = function (options) {
  return Object.assign({}, {
    retries: 5,
    delay: 5000,
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}, useMongoClient: true}
  }, options || {})
}

exports.init = function (options, done) {
  if (typeof options === 'function') {
    done = options
    options = undefined
  }
  options = exports.options(options)
  done = done || function () {}

  // Determine the db name (may be overridden as part of MONGODB_URL)
  var defaultDb = process.env.NODE_ENV === 'test' ? 'shlodge124-test' : 'shlodge124'
  var db = process.env.MONGODB_DB || defaultDb

  // Determine full mongo url
  var url
  if (process.env.MONGODB_URL) {
    // Add db name if there isn't one
    url = process.env.MONGODB_URL.replace(/(:\d+)\/?$/, '$1/' + db)
  } else {
    var host = process.env.MONGODB_HOST || '127.0.0.1'
    var port = process.env.MONGODB_PORT || '27017'
    url = 'mongodb://' + host + ':' + port + '/' + db
  }

  mongoose.connection.on('error', function (err) {
    console.error(err, 'Mongoose connection error!')
  })

  connect(options.retries, done)

  function connect (retries, done) {
    console.log('mongoose connecting')
    mongoose.connect(url, {server: options.server}, function (err) {
      if (!err) {
        console.log('Mongoose connected to MongoDB!')
        return done()
      }
      console.error(err, 'mongoose connect failed')
      if (--retries > 0) {
        console.log('mongoose connect retrying')
        return setTimeout(connect.bind(null, retries, done), options.delay)
      }
      done(err)
    })
  }
}

exports.disconnect = function (done) {
  return mongoose.disconnect(done)
}

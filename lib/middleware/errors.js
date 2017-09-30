
var util = require('util')

function MiddlewareError (message, statusCode, view, locals) {
  Error.call(this)
  Error.captureStackTrace(this, MiddlewareError)
  this.message = message || 'Unknown Error'
  statusCode = parseInt(statusCode, 10)
  this.statusCode = isNaN(statusCode) ? 500 : statusCode

  if (view && typeof view === 'object') {
    locals = view
    view = undefined
  }

  this.view = view || 'errors/' + this.statusCode
  this.locals = locals || {}
  this.locals.title = this.locals.title || 'Spring Hill Masonic Lodge| Error'
}
util.inherits(MiddlewareError, Error)

MiddlewareError.prototype.handler = function (req, res) {
  res.status(this.statusCode).render(this.view)
}

function NotFoundError (message, view, locals) {
  if (view && typeof view === 'object') {
    locals = view
    view = undefined
  }

  locals = locals || {}
  var title = locals.title

  message = message || 'Not Found'
  MiddlewareError.call(this, message, 404, view, locals)
  this.locals.title = title || 'PHY.net | Not Found'
  Error.captureStackTrace(this, NotFoundError)
}
util.inherits(NotFoundError, MiddlewareError)

function handler (err, req, res, next) {
  if (!err || !(err instanceof MiddlewareError)) return next(err)
  err.handler(req, res)
}

module.exports = {
  MiddlewareError: MiddlewareError,
  NotFoundError: NotFoundError,
  handler: handler
}

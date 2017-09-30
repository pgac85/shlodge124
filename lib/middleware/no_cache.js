/**
 * Middleware - No Cache Module
 *
 * Copyright (c) 2014 BKON Connect LLC. All rights reserved.
 */

module.exports = function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  return next()
}

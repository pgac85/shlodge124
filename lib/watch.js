
var path = require('path')
var Watchpack = require('watchpack')

module.exports = function watch (files, dirs, re, fn) {
  files = [].concat(files || []).map(p => path.resolve(p))
  dirs = [].concat(dirs || []).map(p => path.resolve(p))
  re = re || /.*/
  fn = fn || (() => true)
  var watcher = new Watchpack()
  var changed = false
  var change = f => changed = changed || re.test(f)
  var aggregated = fs => changed = !(changed && fn(fs) || true)
  watcher.on('change', change)
  watcher.on('aggregated', aggregated)
  watcher.watch(files, dirs, Date.now() + 1000)
  return () => {
    watcher.removeListener('change', change)
    watcher.removeListener('aggregated', aggregated)
    watcher.close()
  }
}

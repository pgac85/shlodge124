
const vm = require('vm')
const path = require('path')
const extract = path.dirname(require.resolve('extract-text-webpack-plugin'))

module.exports = function (source) {
  if (this.cacheable) this.cacheable()
  if (!this[extract](null)) return source
  const exec = (source, ctx, id) => {
    const module = {id, exports: {}}
    const context = {
      __webpack_public_path__: this.options.output.publicPath || '',
      module: module,
      exports: module.exports,
      require: pkg => {
        const res = this.resolveSync(ctx, pkg)
        const dep = this._module.dependencies.find(d => {
          return d.module && d.module.resource === res && d.module._source._value
        })
        if (!dep) throw new Error('Invalid dep')
        return exec(dep.module._source._value, path.dirname(res), dep.module.identifier())
      }
    }
    vm.runInNewContext(source, context)
    return module.exports
  }
  const module = exec(source, this.context, this._module.identifier())
  this[extract](module)
  source = '// removed by extract-text-webpack-plugin'
  if (!module || !module.locals) return source
  return `${source}\nmodule.exports = ${JSON.stringify(module.locals)};`
}

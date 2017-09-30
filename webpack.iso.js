
var path = require('path')
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')

module.exports = {
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/_assets/'
  },
  options: {
    assets: {
      images: {
        extensions: ['jpeg', 'jpg', 'png', 'gif', 'svg'],
        parser: WebpackIsomorphicToolsPlugin.urlLoaderParser
      },
      fonts: {
        extensions: ['ttf', 'eot', 'woff', 'woff2'],
        parser: WebpackIsomorphicToolsPlugin.urlLoaderParser
      },
      styleModules: {
        extensions: ['css', 'styl'],
        filter (module, regex, options, log) {
          return options.development ? WebpackIsomorphicToolsPlugin.styleLoaderFilter(module, regex, options, log) : regex.test(module.name)
        },
        path (module, options, log) {
          return options.development ? WebpackIsomorphicToolsPlugin.styleLoaderPathExtractor(module, options, log) : module.name
        },
        parser (module, options, log) {
          return options.development ? WebpackIsomorphicToolsPlugin.cssModulesLoaderParser(module, options, log) : module.source
        }
      }
    }
  }
}

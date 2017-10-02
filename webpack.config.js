
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const wpisocfg = require('./webpack.iso.js')
const extract = require.resolve('./lib/webpack-extract.js')
const promise = require.resolve('promise/polyfill.js')
const hot = path.resolve('lib/middleware/assets.js')
const app = path.resolve('app/javascripts/index.js')

const reScript = /\.m?jsx?$/;
const reStyle = /\.(css|less|scss|sss)$/;
const reImage = /\.(bmp|gif|jpe?g|png|svg)$/;

module.exports = (options) => {
  if (!options || typeof options === 'string') options = {dev: options === 'dev'}
  options = Object.assign({}, options)
  options.dev = !!options.dev
  options.hot = options.dev && !!options.hot
  options.min = !options.dev || options.min
  options.publicPath = options.publicPath || wpisocfg.output.publicPath

  const polyfillEntries = [promise]
  const hotEntries = options.hot ? [hot] : []
  const commonEntries = es => [].concat(polyfillEntries, es, hotEntries)

  const entry = {
    app: commonEntries([app])
  }

  const isoPlugin = new WebpackIsomorphicToolsPlugin(wpisocfg.options).development(options.dev)

  const cssLoader = {
    include: path.resolve(__dirname, '../app'),
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: options.dev,
      modules: true,
      localIdentName: options.dev
        ? '[name]-[local]-[hash:base64:5]'
        : '[hash:base64:5]',
      minimize: !options.dev,
      discardComments: { removeAll: true },
    },
  }

  const stylusLoader = {
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'stylus-loader']
    })
  }

  const jsonLoader = {
    test: /\.json$/,
    loaders: ['json']
  }
  const babelLoader = {
    test: /\.jsx?$/,
    include: [path.resolve('app'), path.resolve('lib')],
    loaders: [{
      loader: 'babel-loader',
      query: {
        compact: false,
        cacheDirectory: true
      }
    }]
  }
  const babelErrLoader = {
    loaders: [{
      loader: 'babel-loader',
      query: Object.assign({}, babelLoader.loaders[0].query, {plugins: []})
    }]
  }
  const isoLoader = {
    test: WebpackIsomorphicToolsPlugin.regular_expression([].concat(
      isoPlugin.options.assets.images.extensions,
      isoPlugin.options.assets.fonts.extensions)),
    exclude: /images\/head/,
    loaders: [{
      loader: 'url',
      query: {limit: 5000}
    }]
  }
  const isoHeadLoader = {
    test: WebpackIsomorphicToolsPlugin.regular_expression([].concat(
      isoPlugin.options.assets.images.extensions,
      isoPlugin.options.assets.fonts.extensions)),
    include: /images\/head/,
    loaders: [{loader: 'file'}]
  }
  const rules = [
    cssLoader,
    stylusLoader,
    jsonLoader,
    babelLoader,
    isoLoader,
    isoHeadLoader
  ].concat(options.dev ? babelErrLoader : [])

  const devPlugins = () => [
    new webpack.WatchIgnorePlugin([/node_modules/]),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({filename: '[name].css', allChunks: true})
  ]
  const hotPlugins = () => [
    new webpack.HotModuleReplacementPlugin()
  ]
  const minPlugins = () => [
    new webpack.optimize.UglifyJsPlugin()
  ]
  const prodPlugins = () => [
    new ExtractTextPlugin('[name].css')
  ]
  const commonPlugins = [
    new webpack.LoaderOptionsPlugin({minimize: options.min, debug: options.dev}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: '[name].js',
      chunks: ['app']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${options.dev ? 'development' : 'production'}"`
    }),
    isoPlugin
  ]
  const plugins = [].concat(
    options.dev ? devPlugins() : [],
    options.hot ? hotPlugins() : [],
    options.min ? minPlugins() : [],
    !options.dev ? prodPlugins() : [],
    commonPlugins
  )

  const devtool = options.dev && (options.devtool === 'none' ? false : options.devtool || '#cheap-module-eval-source-map')

  return {
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'web', 'browserify', 'main']
    },
    devtool,
    context: wpisocfg.context,
    entry,
    output: Object.assign({}, wpisocfg.output, {
      filename: '[name].js',
      chunkFilename: '[name].js',
      pathinfo: options.dev,
      publicPath: options.publicPath
    }),
    module: {rules},
    plugins
  }
}

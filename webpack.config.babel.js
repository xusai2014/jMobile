import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
  entry: {
    main: process.env.mode === 'production' ? [path.resolve(__dirname, './src/reactApp.jsx')]
      : [path.resolve(__dirname, './src/reactApp.jsx'), 'webpack-hot-middleware/client'],
    vendor: ['babel-polyfill', 'react', 'react-dom', 'whatwg-fetch', 'core-js']
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'public/client.bundle.[hash].js',
    chunkFilename: 'public/[name].[chunkhash:5].js',
    sourceMapFilename: '[file].map',
    publicPath: '/'
  },
  devtool: process.env.mode === 'production' ? '' : 'source-map',
  target: 'web',
  watch: process.env.mode !== 'production',
  cache: process.env.mode !== 'production',
  mode: process.env.mode,
  module: {
    unsafeCache: process.env.mode !== 'production',
    rules: [
      {
        test: /\.(jsx|js)?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true
        }
      },
      {
        test: /\.css?$/,
        use: [
          'style-loader', // creates style nodes from JS strings,
          {
            loader: 'postcss-loader',
            options: {
              path: path.join(__dirname, './postcss.config.js'),
            }
          }
        ]
      },
      {
        test: /\.less?$/,
        exclude: /node_modules/,
        use: [
          'style-loader', // creates style nodes from JS strings,
          'css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]', // translates CSS into CommonJS
          'postcss-loader',
          {
            loader: 'less-loader', options: { javascriptEnabled: true }
          }
        ]
      }, {
        test: /\.less?$/,
        include: /node_modules/,
        use: [
          'style-loader', // creates style nodes from JS strings,
          'postcss-loader',
          {
            loader: 'less-loader', options: { javascriptEnabled: true }
          }
        ]
      },
      { test: /\.(png|jpg|svg|gif)$/, loader: 'url-loader?limit=25000&name=public/[name][hash:8].[ext]' },//指定图片路径
      { test: /\.(woff|ttf|eot|woff2)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(md|markdown)$/, use: ['html-loader', 'markdown-loader'] },
    ]
  },
  externals: {
    jquery: 'jQuery',
    fastclick: 'FastClick',
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.scss', '.less', '.css'],
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by Jerry'),
    new HtmlWebpackPlugin({
      chunks: ['main', 'vendor', 'runtime~main'],
      filename: 'index.html',
      template: './template/index.html',
      title: '',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin(
      [{ from: './static', to: './static' }],
      { copyUnmodified: true }
    ),

    process.env.mode !== 'production' ? new webpack.HotModuleReplacementPlugin() : () => {
    }
  ],
  optimization: {
    nodeEnv: process.env.mode,
    noEmitOnErrors: true,
    runtimeChunk: true,
    removeAvailableModules: true,
    splitChunks: {
      name: () => {
      }, // 名称，此选项可接收 function
      cacheGroups: { // 这里开始设置缓存的 chunks
        vendor: { // key 为entry中定义的 入口名称
          chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          test: /react|whatwg-fetch|react-dom|babel-polyfill|core-js/, // 正则规则验证，如果符合就提取 chunk
          name: 'vendor' // 要缓存的 分隔出来的 chunk 名称
        }
      }
    }
  }
};

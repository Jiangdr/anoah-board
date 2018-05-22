const path = require('path');
const utils = require('./utils')
const webpack = require('webpack');

module.exports = {
  entry: {
    'mp3player': './src/plugins/mp3player/mp3player.js'
  },
  output: {
    path: path.resolve(__dirname, '../qtivue'),
    publicPath: './',
    library: 'mp3player',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader',
            sass: 'vue-style-loader!css-loader!sass-loader'
          },
          postLoaders: {
            html: 'babel-loader'
          }
        }
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader'
        ]
      },{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}

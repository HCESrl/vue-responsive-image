const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const nodeExternals = require('webpack-node-externals')

var commonConfig = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        // include: path.join(__dirname, 'resources', 'vue'),
        loader: 'vue-loader',
        options: {
          extractCSS: process.env.NODE_ENV === 'production' ? extractPluginIstance : false,
          postcss: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
  ]
}

module.exports = function(env, argv) {
  if (typeof argv === 'undefined') {
    argv = {
      mode: 'test'
    }
  }
  switch (argv.mode) {
    case 'production':
      return [ // Config 1: For browser environment
        merge(commonConfig, {
          entry: path.resolve(__dirname + '/src/plugin.js'),
          output: {
            filename: 'vue-responsive-image.web.min.js',
            libraryTarget: 'window',
            library: 'VueResponsiveImage'
          }
        }),
        // Config 2: For Node-based development environments
        merge(commonConfig, {
          entry: path.resolve(__dirname + '/src/ResponsiveImage.vue'),
          output: {
            filename: 'vue-responsive-image.js',
            libraryTarget: 'umd',

            // These options are useful if the user wants to load the module with AMD
            library: 'vue-responsive-image',
            umdNamedDefine: true
          }
        })
      ]
    case 'test':
      return merge(commonConfig, {
        mode: 'development',
        externals: [nodeExternals()],
        devtool: 'inline-cheap-module-source-map'
      })
    case 'development':
      return merge(commonConfig, {
        entry: path.resolve(__dirname + '/src/index.js'),
        output: {
          path: path.resolve(__dirname + '/dev/'),
          filename: 'vue-responsive-image.js'
        },
        plugins: [
          new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
          })
        ],
        devServer: {
          useLocalIp: true,
          host: '0.0.0.0',
          disableHostCheck: true,

        }
      })
    default:
      console.error('mode not found')
  }
}

const path = require('path');
const devMiddleware = require("webpack-dev-middleware");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const dev = process.env.NODE_ENV !== 'production'



module.exports = {
  devtool: 'source-map', 
  plugins: [
    new MiniCssExtractPlugin({filename: './css/[name].css'}),
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   online: true,
    //   tunnel: true,
    //   port: 3000,
    //   proxy: 'http://localhost:8080/'
    // })
  ],
  entry: {
    // app: [
    //   './src/js/app.js',
    //   './src/scss/bugano-main.scss',
    //   './src/scss/bugano-custom.scss'
    // ],
    app: {import: './src/js/app.js', filename: "./js/[name].js"},
    //canvas: {import: './src/js/canvas.js', filename: "./js/[name].js"},
    'bugano-main': {import: './src/scss/bugano-main.scss'},
    'bugano-custom': {import: './src/scss/bugano-custom.scss'}
    
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: "./js/[name].js",
  },
  devServer: {
    //https: true,
    
    static: path.resolve(__dirname, './'),
    port: 8080,
    hot: true,
    //liveReload: false,
    //watchFiles: 'node_modules/**/*',
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      serverSideRender: true,
      writeToDisk: true,
    },
    allowedHosts: ['all']
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            
            loader: 'style-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          // {
            
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: function () {
          //         return [
          //           require('autoprefixer')
          //         ];
          //       }
          //     }
          //   }
          // },
          {
            loader: 'sass-loader',
            options: {
              implementation: require("sass"),
              sourceMap: true,
            },
          },
          
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "fonts")],
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "images")],
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
    ]
  },
  snapshot: {
    managedPaths: [],
  }
};
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');

// const isDevelopment = process.env.NODE_ENV !== 'production';
const isDevelopment = false;

module.exports = {
  entry: {
    bundle: './app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devtool: isDevelopment && "source-map",
  devServer: {
    port: 3000,
    open: true
  },
  module: {
    rules: [
      // { test: /\.handlebars$/, loader: "handlebars-loader" },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDevelopment,
              minimize: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 4 versions"]
              },
              sourceMap: isDevelopment,
              plugins: () => [
                autoprefixer
              ]
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',    // where the fonts will go
            publicPath: '../'       // override the default path
          }
        }]
      },
    ]
  },
  plugins: [
    /*
    new webpack.LoaderOptionsPlugin({
        options: {
          handlebarsLoader: {}
        }
      }),
    */
    new MiniCssExtractPlugin({
      filename: "[name]-styles.css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      title: 'My awesome app',
      template: './index.html',
      minify: !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
        removeEmptyElements: true
      },
    })
  ]
};
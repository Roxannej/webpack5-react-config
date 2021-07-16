// scripts/config/webpack.prod.js
const { merge } = require('webpack-merge')
const path = require('path')

const common = require('./webpack.common')
const { PROJECT_PATH } = require('../constant')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(PROJECT_PATH, './dist'),
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  optimization: {
    minimize: true,
    minimizer:[
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        }
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  }
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
  ],
  target: 'browserslist',
  optimization: {
    minimize: true,
    minimizer:[
      new CssMinimizerPlugin()
    ]
  }
})

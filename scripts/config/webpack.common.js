const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { PROJECT_PATH } = require('../constant')
const WebpackBar = require('webpackbar')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const {isDevelopment,isProduction } = require('./env.js')
// 因为后续要配sass和less也需要使用到这套规则，所以这里抽离出来

const getCssLoaders = () => {
  const cssLoaders = [
    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: "[local]--[hash:base64:5]"
        },
        sourceMap: isDevelopment,
      }
    }
  ]
  
  // 开发环境一般用chrom不会有问题，防止开发环境下看样式有一堆前缀影响查看，因此只在生产环境使用
  isProduction && cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          isProduction && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true
              }
            }
          ]
        ]
      }
    }
  })
  
  return cssLoaders
}

module.exports = {
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
    }),
    new WebpackBar({
      name: 'Link Startou!!!', 
      color: '#52c41a' 
    }),
    new CopyPlugin({
      patterns: [
        {
          context: 'public', 
          from: '*',
          to: path.resolve(PROJECT_PATH, './dist/public'), 
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html'],		// **表示任意目录下
          },
        },
      ],
    }),
    new CleanWebpackPlugin()
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [...getCssLoaders()]
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ]

  },
  resolve: {
    alias: {
      'src': path.resolve(PROJECT_PATH, './src'),
      'components': path.resolve(PROJECT_PATH, './src/components'),
      'utils': path.resolve(PROJECT_PATH, './src/utils'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
}

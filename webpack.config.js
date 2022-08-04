const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

let mode = 'development';
if (process.env.NODE_ENV === 'production') mode = 'production';

module.exports = {
  mode,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
  },
  devtool: 'source-map',
  entry: {
    home: './src/pages/home/index.js',
  },
  output: {
    filename: '[name]/[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '' },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new ESLintPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css',
    }),
    new HtmlPlugin({
      filename: './home/index.html',
      template: './src/pages/home/index.html',
      chunks: ['home'],
    }),
  ],
};

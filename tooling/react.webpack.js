/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { shared } = require('./alias');

const rootPath = path.resolve(__dirname, '..');

module.exports = (_, options = {}) => ({
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
    alias: shared,
  },
  entry: path.resolve(rootPath, 'client', 'App.tsx'),
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'electron 11.3.0' }],
              [
                '@babel/preset-react',
                {
                  development: options.mode === 'development',
                },
              ],
              '@babel/preset-typescript',
            ],
            // needed else webpack 4 itself chokes on the syntax
            plugins: ['@babel/plugin-proposal-optional-chaining'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(rootPath, 'build/renderer'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: '0.0.0.0',
    port: 4000,
    publicPath: '/',
  },
  output: {
    path: path.resolve(rootPath, 'build/renderer'),
    filename: 'js/[name].js',
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pancake',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
  ],
});

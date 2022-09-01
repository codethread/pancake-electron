const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { shared, client } = require('./alias');

const rootPath = process.cwd();

module.exports = (_, options = {}) => {
	const isDev = options.mode === 'development';
	return {
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
			mainFields: ['main', 'module', 'browser'],
			alias: {
				...shared,
				...client,
			},
		},
		entry: path.resolve(rootPath, 'client', 'index.tsx'),
		target: 'web',
		devtool: 'cheap-module-eval-source-map',
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
										development: isDev,
									},
								],
								'@babel/preset-typescript',
							],
							// needed else webpack 4 itself chokes on the syntax
							plugins: [
								'@babel/plugin-proposal-optional-chaining',
								'@babel/plugin-proposal-nullish-coalescing-operator',
								isDev && require.resolve('react-refresh/babel'),
							].filter(Boolean),
						},
					},
				},
				{
					test: /\.css$/i,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: ['tailwindcss', 'autoprefixer'],
								},
							},
						},
					],
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
			isDev && new HotModuleReplacementPlugin(),
			isDev && new ReactRefreshWebpackPlugin(),
			new HtmlWebpackPlugin({
				title: 'Pancake',
				meta: {
					viewport: 'width=device-width, initial-scale=1.0',
				},
			}),
		],
	};
};

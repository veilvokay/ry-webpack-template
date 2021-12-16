const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isProd = true;
const getFilename = (n = '[name]') => isProd ? `${n}.[contenthash:6]` : n;

module.exports = {
    context: path.resolve(__dirname, 'app'),
    mode: 'development',
    entry: {
        main: './scripts/index.js',
        analytics: './scripts/Analytics.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.svg', '.png', '.js', '.jsx', '.ejs', '.json', '.html', '.sass', '.scss'],
        alias: {
            app: path.resolve(__dirname, './app/scripts/'),
            assets: path.resolve(__dirname, './app/assets/'),
            styles: path.resolve(__dirname, './app/styles/'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: `assets/fonts/${getFilename()}[ext][query]`,
                },
            },
            {
                test: /\.xml$/,
                // type: 'asset/resource',
                use: ['xml-loader']
                // generator: {
                //     filename: 'mocks/[name][ext][query]',
                // },
            }
        ]
    },
    devServer: {
        static: 'dist',
        hot: false,
    }
}
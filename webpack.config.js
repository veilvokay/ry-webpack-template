const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const getFilename = (n = '[name]') => isProd ? `${n}.[contenthash:6]` : n;

const filename = (ext) => {
        if (process.env.NODE_ENV === 'development') {
            return `[name].${ext}`
        }
        if (process.env.NODE_ENV === 'production') {
            return `[name][contenthash:6].${ext}`;
        }
}

const babelOptions = (preset) => {
    const options = {
        presets: [
            '@babel/preset-env',
        ]
    }

    if (preset) {
        options.presets.push(preset)
    }

    return options;
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }

    return config
}

module.exports = {
    context: path.resolve(__dirname, 'app'),
    mode: 'development',
    entry: {
        main: './scripts/index.js',
        analytics: './scripts/Analytics.ts',
    },
    output: {
        filename: filename('js'),
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
    optimization: optimization(),
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'app/static'),
                    to: path.resolve(__dirname, 'dist/static')
                }
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$|\.s[ac]ss$/,
                resourceQuery: { not: [/inline/] },
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$|\.s[ac]ss$/,
                resourceQuery: /inline/,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|webp|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: `assets/img/${getFilename()}[ext][query]`,
                },
            },
            {
                test: /\.(svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: `assets/img/${getFilename()}[ext][query]`,
                },
                use: [{
                    loader: 'svgo-loader',
                    options: {
                        configFile: path.resolve(__dirname, './svgo.config.js'),
                    },
                }],
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
            },
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /dist/],
                use: {
                  loader: 'babel-loader',
                }
              },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        }
                    }
                ]
              },
        ]
    },
    devServer: {
        static: 'dist',
        port: 8000,
        // hot: isDev, // hot doesnt work for some reason 
        hot: false,
    }
}
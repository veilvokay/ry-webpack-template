import * as Path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const getFilename = (n = '[name]') => isProd ? `${n}.[contenthash:6]` : n;

const filename = (ext) => {
    if (process.env.NODE_ENV === 'development') {
        return `[name].${ext}`;
    }
    if (process.env.NODE_ENV === 'production') {
        return `[name][contenthash:6].${ext}`;
    }
};

const babelOptions = (preset) => {
    const options = {
        presets: [
            '@babel/preset-env',
        ],
    };

    if (preset) {
        options.presets.push(preset);
    }

    return options;
};

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        },
        minimizer: [],
    };

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ];
    }

    return config;
};

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: Path.resolve(__dirname, 'app/static'),
                    to: Path.resolve(__dirname, 'dist/static'),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
    ];

    if (isProd) {
        base.push(new BundleAnalyzerPlugin());
    }
    return base;
};

module.exports = {
    context: Path.resolve(__dirname, 'app'),
    mode: 'development',
    entry: {
        main: './scripts/index.ts',
        analytics: './scripts/Analytics.ts',
    },
    output: {
        filename: filename('js'),
        path: Path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.svg', '.png', '.js', '.jsx', '.ejs', '.json', '.html', '.sass', '.scss'],
        alias: {
            app: Path.resolve(__dirname, './app/scripts/'),
            assets: Path.resolve(__dirname, './app/assets/'),
            styles: Path.resolve(__dirname, './app/styles/'),
        },
    },
    optimization: optimization(),
    plugins: plugins(),
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
                        configFile: Path.resolve(__dirname, './svgo.config.js'),
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
                use: ['xml-loader'],
                // generator: {
                //     filename: 'mocks/[name][ext][query]',
                // },
            },
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /dist/],
                use: {
                    loader: 'babel-loader',
                },
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
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        static: 'dist',
        port: 8000,
        // hot: isDev, // hot doesnt work for some reason
        hot: false,
    },
    devtool: isDev ? 'source-map' : false,
};
